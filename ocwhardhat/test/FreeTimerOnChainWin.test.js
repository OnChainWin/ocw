/**
 * @title Test Suite for FreeTimerOnChainWin Contract
 * @dev This suite tests the full lifecycle of the FreeTimerOnChainWin contract,
 * including deployment, raffle management, user interactions, and administrative functions.
 * It ensures all features behave as expected under various scenarios.
 */
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("FreeTimerOnChainWin", function () {
  let freeTimer;
  let owner;
  let addr1;
  let addr2;

  /**
   * @dev Deploys a new instance of the FreeTimerOnChainWin contract before each test.
   * This ensures a clean state for every test case.
   */
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const FreeTimerOnChainWin = await ethers.getContractFactory("FreeTimerOnChainWin");
    freeTimer = await FreeTimerOnChainWin.deploy();
  });

  /**
   * @dev Tests related to the initial state of the contract upon deployment.
   */
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // @dev Verifies that the contract deployer is correctly set as the owner.
      expect(await freeTimer.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct default values", async function () {
      // @dev Checks that the raffle is initially inactive and no tickets have been sold.
      expect(await freeTimer.raffleStatus()).to.equal(false);
      expect(await freeTimer.ticketsSoldThisRound()).to.equal(0);
    });
  });
  
  /**
   * @dev Tests the functionality of starting a new raffle.
   */
  describe("Starting Raffle", function () {
    it("Should allow the owner to start a raffle after funding the contract", async function () {
      // @dev The contract must be funded before a raffle can be started.
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      const prizeAmount = ethers.parseEther("1");
      const duration = 60; // @dev Duration in minutes.
      
      // @dev Owner starts the raffle with a specified prize and duration.
      await freeTimer.startRaffle(prizeAmount, duration);
      
      // @dev Verifies that the raffle status is active and the prize amount is set correctly.
      expect(await freeTimer.raffleStatus()).to.equal(true);
      expect(await freeTimer.prizeAmount()).to.equal(prizeAmount);
    });

    it("Should reject starting a raffle if the prize amount exceeds contract balance", async function () {
      // @dev Define prize and duration without funding the contract first.
      const prizeAmount = ethers.parseEther("1");
      const duration = 60; 
      
      // @dev Expect the transaction to be reverted because the contract lacks sufficient funds for the prize.
      await expect(
        freeTimer.startRaffle(prizeAmount, duration)
      ).to.be.revertedWith("Not enough balance!");
    });

    it("Should reject starting a raffle if the prize amount is zero", async function () {
      // @dev Fund the contract to ensure balance is not the issue.
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      const prizeAmount = 0;
      const duration = 60;
      
      // @dev Expect the transaction to be reverted because the prize amount cannot be zero.
      await expect(
        freeTimer.startRaffle(prizeAmount, duration)
      ).to.be.revertedWith("Prize amount must be greater than 0!");
    });

    it("Should reject starting a raffle if one is already in progress", async function () {
      // @dev Fund the contract and start a raffle.
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      const prizeAmount = ethers.parseEther("1");
      const duration = 60;
      
      await freeTimer.startRaffle(prizeAmount, duration);
      
      // @dev Attempting to start a second raffle should be reverted.
      await expect(
        freeTimer.startRaffle(prizeAmount, duration)
      ).to.be.revertedWith("Raffle already started.");
    });
  });
  
  /**
   * @dev Tests the functionality for users claiming their free ticket.
   */
  describe("Getting Free Tickets", function () {
    beforeEach(async function () {
      // @dev Fund the contract and start a raffle to set up the test environment.
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      const prizeAmount = ethers.parseEther("1");
      const duration = 60;
      await freeTimer.startRaffle(prizeAmount, duration);
    });

    it("Should allow a user to get a free ticket", async function () {
      // @dev A user claims a free ticket, expecting a NewEntry event.
      await expect(freeTimer.connect(addr1).getFreeTicket())
        .to.emit(freeTimer, "NewEntry")
        .withArgs(addr1.address, 1);
      
      // @dev Verifies the user is marked as having entered and the ticket count is updated.
      expect(await freeTimer.hasEntered(addr1.address)).to.equal(true);
      expect(await freeTimer.ticketsSoldThisRound()).to.equal(1);
    });

    it("Should reject if a user tries to get a second free ticket", async function () {
      // @dev User claims their first free ticket.
      await freeTimer.connect(addr1).getFreeTicket();
      
      // @dev Attempting to claim another ticket should be reverted.
      await expect(
        freeTimer.connect(addr1).getFreeTicket()
      ).to.be.revertedWith("You have already claimed your free ticket.");
    });

    it("Should reject if the raffle is not active", async function () {
      // @dev Manually end the raffle before the user attempts to claim a ticket.
      await freeTimer.hardReset();
      
      // @dev The claim attempt should be reverted as the raffle is not running.
      await expect(
        freeTimer.connect(addr1).getFreeTicket()
      ).to.be.revertedWith("Raffle is not started.");
    });
  });
  
  /**
   * @dev Tests the functionality of ending a raffle.
   */
  describe("Ending Raffle", function () {
    beforeEach(async function () {
      // @dev Set up the test environment with an active raffle and participants.
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      const prizeAmount = ethers.parseEther("1");
      const duration = 60;
      await freeTimer.startRaffle(prizeAmount, duration);
      
      await freeTimer.connect(addr1).getFreeTicket();
      await freeTimer.connect(addr2).getFreeTicket();
    });

    it("Should allow the owner to end the raffle after the duration has passed", async function () {
      // @dev Advance blockchain time to simulate the end of the raffle period.
      await time.increase(60 * 60 + 1); // 60 minutes + 1 second
      
      // @dev Ending the raffle should emit WinnerSelected and RaffleEnded events.
      await expect(freeTimer.tryEndRaffle())
        .to.emit(freeTimer, "WinnerSelected")
        .to.emit(freeTimer, "RaffleEnded");
      
      // @dev Verifies the raffle status is set to inactive.
      expect(await freeTimer.raffleStatus()).to.equal(false);
    });

    it("Should reject ending the raffle if the time has not passed", async function () {
      // @dev Attempting to end the raffle before the duration expires should be reverted.
      await expect(
        freeTimer.tryEndRaffle()
      ).to.be.revertedWith("Raffle period has not ended yet!");
    });

    it("Should allow the owner to forcibly end the raffle with hardReset", async function () {
      // @dev The owner uses hardReset to terminate the raffle prematurely.
      await freeTimer.hardReset();
      // @dev Verifies the raffle is no longer active.
      expect(await freeTimer.raffleStatus()).to.equal(false);
    });
  });
  
  /**
   * @dev Tests winner selection logic and prize distribution.
   */
  describe("Winner Selection and Prize Distribution", function () {
    beforeEach(async function () {
      // @dev Set up the test environment with an active raffle and participants.
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      const prizeAmount = ethers.parseEther("1");
      const duration = 60;
      await freeTimer.startRaffle(prizeAmount, duration);
      
      await freeTimer.connect(addr1).getFreeTicket();
      await freeTimer.connect(addr2).getFreeTicket();
    });

    it("Should select a winner and distribute the prize when ending the raffle", async function () {
      // @dev Advance time past the raffle's end.
      await time.increase(60 * 60 + 1);
      
      // @dev Store participant balances before the prize is distributed.
      const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
      const addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
      
      // @dev End the raffle and get the transaction receipt.
      const tx = await freeTimer.tryEndRaffle();
      const receipt = await tx.wait();
      
      // @dev Check that a winner was recorded.
      expect(await freeTimer.getTotalWinners()).to.equal(1);
      
      // @dev Confirm the WinnerSelected event was emitted.
      const winnerSelectedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'WinnerSelected'
      );
      expect(winnerSelectedEvent).to.not.be.undefined;
      
      // @dev Verify the raffle is inactive.
      expect(await freeTimer.raffleStatus()).to.equal(false);
      
      // @dev Check balances after prize distribution to confirm one player received the prize.
      const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
      const addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
      
      const prizeAmount = ethers.parseEther("1");
      const someoneGotPrize = 
        addr1BalanceAfter >= addr1BalanceBefore + prizeAmount - ethers.parseEther("0.01") || // accounts for gas
        addr2BalanceAfter >= addr2BalanceBefore + prizeAmount - ethers.parseEther("0.01");   // accounts for gas
      
      expect(someoneGotPrize).to.be.true;
    });

    it("Should provide information about the winner after the raffle ends", async function () {
      // @dev Advance time and end the raffle.
      await time.increase(60 * 60 + 1);
      await freeTimer.tryEndRaffle();
      
      // @dev Verify a winner has been recorded.
      expect(await freeTimer.getTotalWinners()).to.equal(1);
      
      // @dev Retrieve winner information and confirm it's one of the participants.
      const winnerIndex = await freeTimer.getTotalWinners() - 1n;
      const [winnerAddress, winnerWins] = await freeTimer.getWinnerByIndex(winnerIndex);
      
      expect(winnerAddress).to.be.oneOf([addr1.address, addr2.address]);
    });

    it("Should clear player entries after selecting a winner", async function () {
      // @dev Advance time and end the raffle.
      await time.increase(60 * 60 + 1);
      await freeTimer.tryEndRaffle();
      
      // @dev Verify that all entries from the previous round have been reset.
      expect(await freeTimer.hasEntered(addr1.address)).to.equal(false);
      expect(await freeTimer.hasEntered(addr2.address)).to.equal(false);
      expect(await freeTimer.ticketsSoldThisRound()).to.equal(0);
    });
  });
  
  /**
   * @dev Tests administrative functions like depositing and withdrawing funds.
   */
  describe("Contract Administration", function () {
    it("Should allow the owner to deposit funds", async function () {
      // @dev The owner deposits funds into the contract.
      const depositAmount = ethers.parseEther("5");
      
      // @dev The transaction should execute without reverting.
      await expect(
        freeTimer.initialDeposit({ value: depositAmount })
      ).to.not.be.reverted;
    });

    it("Should allow the owner to withdraw funds when the raffle is not active", async function () {
      // @dev Deposit funds while the raffle is inactive.
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      // @dev The withdrawal should execute without reverting.
      await expect(
        freeTimer.withdrawFunds()
      ).to.not.be.reverted;
    });

    it("Should reject withdrawal when a raffle is active", async function () {
      // @dev Fund the contract and start a raffle.
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      const prizeAmount = ethers.parseEther("1");
      const duration = 60;
      await freeTimer.startRaffle(prizeAmount, duration);
      
      // @dev Attempting to withdraw during an active raffle should be reverted.
      await expect(
        freeTimer.withdrawFunds()
      ).to.be.revertedWith("Cannot withdraw before raffle has ended.");
    });
  });
  
  /**
   * @dev Tests view functions that return contract state information.
   */
  describe("View Functions", function () {
    beforeEach(async function () {
      // @dev Set up the environment with an active raffle and one participant.
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      const prizeAmount = ethers.parseEther("1");
      const duration = 60;
      await freeTimer.startRaffle(prizeAmount, duration);
      await freeTimer.connect(addr1).getFreeTicket();
    });

    it("Should return the correct ticket count", async function () {
      // @dev Verifies that the number of tickets sold is accurate.
      expect(await freeTimer.ticketsSoldThisRound()).to.equal(1);
    });
    
    it("Should return the correct hasEntered status for players", async function () {
      // @dev Checks the entry status for a participant and a non-participant.
      expect(await freeTimer.hasEntered(addr1.address)).to.equal(true);
      expect(await freeTimer.hasEntered(addr2.address)).to.equal(false);
    });

    it("Should return the correct remaining time", async function () {
      // @dev Checks the initial remaining time in seconds and minutes.
      const remainingTimeSec = await freeTimer.getRemainingTimeSec();
      expect(remainingTimeSec).to.be.gt(0);
      
      const remainingTimeMin = await freeTimer.getRemainingTimeMin();
      expect(remainingTimeMin).to.be.closeTo(60, 1);
      
      // @dev Advance time and verify that the remaining time has decreased.
      await time.increase(30 * 60); // 30 minutes
      
      const remainingTimeMinAfter = await freeTimer.getRemainingTimeMin();
      expect(remainingTimeMinAfter).to.be.closeTo(30, 1);
    });
    
    it("Should return the correct total number of winners initially", async function () {
      // @dev Before any raffle has concluded, the winner count should be zero.
      expect(await freeTimer.getTotalWinners()).to.equal(0);
    });
  });
}); 