/**
 * Test suite for the FreeTimerOnChainWin contract
 * Tests cover deployment, raffle lifecycle, ticket claiming, winner selection, and admin functions
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
   * Deploy a fresh contract instance before each test
   */
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const FreeTimerOnChainWin = await ethers.getContractFactory("FreeTimerOnChainWin");
    freeTimer = await FreeTimerOnChainWin.deploy();
  });

  /**
   * Tests for initial contract deployment state
   */
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await freeTimer.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct values", async function () {
      expect(await freeTimer.raffleStatus()).to.equal(false);
      expect(await freeTimer.ticketsSoldThisRound()).to.equal(0);
    });
  });
  
  /**
   * Tests for the raffle creation functionality
   */
  describe("Starting Raffle", function () {
    it("Should allow owner to start a raffle after funding contract", async function () {
      // Fund contract via initialDeposit function instead
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      const prizeAmount = ethers.parseEther("1");
      const duration = 60; // 60 minutes
      
      await freeTimer.startRaffle(prizeAmount, duration);
      
      expect(await freeTimer.raffleStatus()).to.equal(true);
      expect(await freeTimer.prizeAmount()).to.equal(prizeAmount);
    });

    it("Should reject start if prize amount exceeds contract balance", async function () {
      const prizeAmount = ethers.parseEther("1"); // No funds deposited
      const duration = 60; // 60 minutes
      
      await expect(
        freeTimer.startRaffle(prizeAmount, duration)
      ).to.be.revertedWith("Not enough balance!");
    });

    it("Should reject start if prize amount is zero", async function () {
      // First fund the contract
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      const prizeAmount = 0;
      const duration = 60; // 60 minutes
      
      await expect(
        freeTimer.startRaffle(prizeAmount, duration)
      ).to.be.revertedWith("Prize amount must be greater than 0!");
    });

    it("Should reject start if raffle is already in progress", async function () {
      // First fund the contract
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      const prizeAmount = ethers.parseEther("1");
      const duration = 60; // 60 minutes
      
      await freeTimer.startRaffle(prizeAmount, duration);
      
      await expect(
        freeTimer.startRaffle(prizeAmount, duration)
      ).to.be.revertedWith("Raffle already started.");
    });
  });
  
  /**
   * Tests for the free ticket claiming functionality
   */
  describe("Getting Free Tickets", function () {
    beforeEach(async function () {
      // Fund the contract
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      // Start a raffle
      const prizeAmount = ethers.parseEther("1");
      const duration = 60; // 60 minutes
      await freeTimer.startRaffle(prizeAmount, duration);
    });

    it("Should allow a user to get a free ticket", async function () {
      await expect(freeTimer.connect(addr1).getFreeTicket())
        .to.emit(freeTimer, "NewEntry")
        .withArgs(addr1.address, 1);
      
      expect(await freeTimer.hasEntered(addr1.address)).to.equal(true);
      expect(await freeTimer.ticketsSoldThisRound()).to.equal(1);
    });

    it("Should reject if user tries to get a second free ticket", async function () {
      await freeTimer.connect(addr1).getFreeTicket();
      
      await expect(
        freeTimer.connect(addr1).getFreeTicket()
      ).to.be.revertedWith("You have already claimed your free ticket.");
    });

    it("Should reject if raffle is not active", async function () {
      // End the raffle first
      await freeTimer.hardReset();
      
      await expect(
        freeTimer.connect(addr1).getFreeTicket()
      ).to.be.revertedWith("Raffle is not started.");
    });
  });
  
  /**
   * Tests for ending the raffle functionality
   */
  describe("Ending Raffle", function () {
    beforeEach(async function () {
      // Fund the contract
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      // Start a raffle
      const prizeAmount = ethers.parseEther("1");
      const duration = 60; // 60 minutes
      await freeTimer.startRaffle(prizeAmount, duration);
      
      // Add some players
      await freeTimer.connect(addr1).getFreeTicket();
      await freeTimer.connect(addr2).getFreeTicket();
    });

    it("Should allow owner to end raffle after time has passed", async function () {
      // Fast forward time
      await time.increase(60 * 60 + 1); // 60 minutes + 1 second
      
      await expect(freeTimer.tryEndRaffle())
        .to.emit(freeTimer, "WinnerSelected")
        .to.emit(freeTimer, "RaffleEnded");
      
      expect(await freeTimer.raffleStatus()).to.equal(false);
    });

    it("Should reject end raffle if time has not passed", async function () {
      await expect(
        freeTimer.tryEndRaffle()
      ).to.be.revertedWith("Raffle period has not ended yet!");
    });

    it("Should allow owner to force end raffle with hardReset", async function () {
      await freeTimer.hardReset();
      expect(await freeTimer.raffleStatus()).to.equal(false);
    });
  });
  
  /**
   * Tests for winner selection and prize distribution
   */
  describe("Winner Selection and Prize Distribution", function () {
    beforeEach(async function () {
      // Fund the contract
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      // Start a raffle
      const prizeAmount = ethers.parseEther("1");
      const duration = 60; // 60 minutes
      await freeTimer.startRaffle(prizeAmount, duration);
      
      // Add some players
      await freeTimer.connect(addr1).getFreeTicket();
      await freeTimer.connect(addr2).getFreeTicket();
    });

    it("Should select a winner and distribute prize when ending raffle", async function () {
      // Fast forward time
      await time.increase(60 * 60 + 1); // 60 minutes + 1 second
      
      // Get balances before ending raffle
      const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
      const addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
      
      // End raffle
      const tx = await freeTimer.tryEndRaffle();
      const receipt = await tx.wait();
      
      // Check that we have a winner
      expect(await freeTimer.getTotalWinners()).to.equal(1);
      
      // Check if WinnerSelected event was emitted
      const winnerSelectedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'WinnerSelected'
      );
      expect(winnerSelectedEvent).to.not.be.undefined;
      
      // Check that raffle has ended
      expect(await freeTimer.raffleStatus()).to.equal(false);
      
      // One of the players should have received the prize
      const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
      const addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
      
      const prizeAmount = ethers.parseEther("1");
      const someoneGotPrize = 
        addr1BalanceAfter >= addr1BalanceBefore + prizeAmount - ethers.parseEther("0.01") || // account for gas used if addr1 is winner
        addr2BalanceAfter >= addr2BalanceBefore + prizeAmount - ethers.parseEther("0.01");   // account for gas used if addr2 is winner
      
      expect(someoneGotPrize).to.be.true;
    });

    it("Should provide information about the winner after raffle ends", async function () {
      // Fast forward time
      await time.increase(60 * 60 + 1); // 60 minutes + 1 second
      
      // End raffle
      await freeTimer.tryEndRaffle();
      
      // Check that we have a winner
      expect(await freeTimer.getTotalWinners()).to.equal(1);
      
      // Get the winner
      const winnerIndex = await freeTimer.getTotalWinners() - 1n;
      const [winnerAddress, winnerWins] = await freeTimer.getWinnerByIndex(winnerIndex);
      
      // Winner should be one of our players
      expect(winnerAddress).to.be.oneOf([addr1.address, addr2.address]);
    });

    it("Should clear player entries after selecting winner", async function () {
      // Fast forward time
      await time.increase(60 * 60 + 1); // 60 minutes + 1 second
      
      // End raffle
      await freeTimer.tryEndRaffle();
      
      // Check that entries have been reset
      expect(await freeTimer.hasEntered(addr1.address)).to.equal(false);
      expect(await freeTimer.hasEntered(addr2.address)).to.equal(false);
      expect(await freeTimer.ticketsSoldThisRound()).to.equal(0);
    });
  });
  
  /**
   * Tests for contract administrative functions
   */
  describe("Contract Administration", function () {
    it("Should allow owner to deposit funds", async function () {
      // Just test the deposit without checking balance
      const depositAmount = ethers.parseEther("5");
      
      await expect(
        freeTimer.initialDeposit({ value: depositAmount })
      ).to.not.be.reverted;
    });

    it("Should allow owner to withdraw funds when raffle is not active", async function () {
      // First deposit some funds
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      // Withdraw funds should not revert
      await expect(
        freeTimer.withdrawFunds()
      ).to.not.be.reverted;
    });

    it("Should reject withdrawal when raffle is active", async function () {
      // Fund the contract
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      // Start a raffle
      const prizeAmount = ethers.parseEther("1");
      const duration = 60; // 60 minutes
      await freeTimer.startRaffle(prizeAmount, duration);
      
      await expect(
        freeTimer.withdrawFunds()
      ).to.be.revertedWith("Cannot withdraw before raffle has ended.");
    });
  });
  
  /**
   * Tests for view functions and contract state queries
   */
  describe("View Functions", function () {
    beforeEach(async function () {
      // Fund the contract
      await freeTimer.initialDeposit({ value: ethers.parseEther("10") });
      
      // Start a raffle
      const prizeAmount = ethers.parseEther("1");
      const duration = 60; // 60 minutes
      await freeTimer.startRaffle(prizeAmount, duration);
      
      // Add a player
      await freeTimer.connect(addr1).getFreeTicket();
    });

    it("Should return correct ticket count", async function () {
      expect(await freeTimer.ticketsSoldThisRound()).to.equal(1);
    });
    
    it("Should return correct hasEntered status", async function () {
      expect(await freeTimer.hasEntered(addr1.address)).to.equal(true);
      expect(await freeTimer.hasEntered(addr2.address)).to.equal(false);
    });

    it("Should return correct remaining time", async function () {
      // Get remaining time in seconds
      const remainingTimeSec = await freeTimer.getRemainingTimeSec();
      expect(remainingTimeSec).to.be.gt(0);
      
      // Remaining time in minutes should be close to 60 (consider some seconds have passed)
      const remainingTimeMin = await freeTimer.getRemainingTimeMin();
      expect(remainingTimeMin).to.be.closeTo(60, 1);
      
      // After some time passes, remaining time should decrease
      await time.increase(30 * 60); // 30 minutes
      
      const remainingTimeMinAfter = await freeTimer.getRemainingTimeMin();
      expect(remainingTimeMinAfter).to.be.closeTo(30, 1);
    });
    
    it("Should return correct total winners initially", async function () {
      expect(await freeTimer.getTotalWinners()).to.equal(0);
    });
  });
}); 