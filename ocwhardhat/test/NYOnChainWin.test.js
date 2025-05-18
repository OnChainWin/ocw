/**
 * Test suite for the NYOnChainWin contract
 * Tests cover deployment, raffle setup, ticket purchases, winner selection, and contract administration
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("NYOnChainWin", function () {
  let nyContract;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  /**
   * Deploy a fresh contract instance before each test
   */
  beforeEach(async function () {
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    const NYOnChainWin = await ethers.getContractFactory("NYOnChainWin");
    nyContract = await NYOnChainWin.deploy();
  });

  /**
   * Tests for initial contract deployment state
   */
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nyContract.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct values", async function () {
      expect(await nyContract.raffleStatus()).to.equal(false);
      expect(await nyContract.totalEntries()).to.equal(0);
      expect(await nyContract.prizePool()).to.equal(0);
    });
  });

  /**
   * Tests for the raffle setup functionality
   */
  describe("Setting up Raffle", function () {
    it("Should allow owner to setup a raffle", async function () {
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      
      await expect(nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee))
        .to.emit(nyContract, "RaffleStarted");
      
      expect(await nyContract.raffleStatus()).to.equal(true);
      expect(await nyContract.targetPrizeAmount()).to.equal(targetPrizeAmount);
      expect(await nyContract.entryFee()).to.equal(entryFee);
    });

    it("Should reject setup if raffle is already in progress", async function () {
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      await expect(
        nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee)
      ).to.be.revertedWith("Raffle already in progress.");
    });

    it("Should reject setup if parameters are invalid", async function () {
      // Test with zero target prize amount
      await expect(
        nyContract.setupRaffle(0, 60, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Invalid entry fee.");
      
      // Test with zero duration
      await expect(
        nyContract.setupRaffle(ethers.parseEther("1"), 0, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Invalid duration.");
      
      // Test with zero entry fee
      await expect(
        nyContract.setupRaffle(ethers.parseEther("1"), 60, 0)
      ).to.be.revertedWith("Invalid entry fee.");
    });
  });

  /**
   * Tests for the ticket purchasing functionality
   */
  describe("Buying Entries", function () {
    beforeEach(async function () {
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
    });

    it("Should allow a user to buy entries", async function () {
      const numberOfEntries = 2n;
      const entryFee = await nyContract.entryFee();
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n; // Including 5% commission
      
      await expect(nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost }))
        .to.emit(nyContract, "NewEntry")
        .withArgs(addr1.address, numberOfEntries);
      
      expect(await nyContract.entryCount(addr1.address)).to.equal(numberOfEntries);
      expect(await nyContract.totalEntries()).to.equal(numberOfEntries);
      
      // Prize pool should have increased by (entryFee * numberOfEntries)
      const expectedPrizePool = entryFee * numberOfEntries;
      expect(await nyContract.prizePool()).to.equal(expectedPrizePool);
    });

    it("Should reject if payment is insufficient", async function () {
      const numberOfEntries = 2n;
      const entryFee = await nyContract.entryFee();
      const insufficientPayment = entryFee * numberOfEntries; // Missing commission
      
      await expect(
        nyContract.connect(addr1).buyEntry(numberOfEntries, { value: insufficientPayment })
      ).to.be.revertedWith("You need to pay much more.");
    });

    it("Should reject if raffle is not active", async function () {
      await nyContract.hardReset(); // Reset the raffle
      
      const numberOfEntries = 2n;
      const entryFee = ethers.parseEther("0.1"); // Use the previous entry fee
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n;
      
      await expect(
        nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost })
      ).to.be.revertedWith("Raffle has not started or finished yet.");
    });

    it("Should automatically end raffle and select winner when target prize is reached", async function () {
      const targetPrizeAmount = await nyContract.targetPrizeAmount();
      const entryFee = await nyContract.entryFee();
      
      // Calculate how many entries needed to reach the target prize
      const entriesNeeded = (targetPrizeAmount * 100n) / (entryFee * 105n) + 1n; // +1 to ensure we exceed
      
      // Buy enough entries to trigger automatic ending
      const totalCost = (entryFee * entriesNeeded * 105n) / 100n;
      
      await expect(nyContract.connect(addr1).buyEntry(entriesNeeded, { value: totalCost }))
        .to.emit(nyContract, "RaffleEnded");
      
      expect(await nyContract.raffleStatus()).to.equal(false);
    });
  });

  /**
   * Tests for the winner selection functionality
   */
  describe("Selecting Winner", function () {
    beforeEach(async function () {
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      // Buy some entries
      const numberOfEntries = 5n;
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n;
      
      await nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
    });

    it("Should allow owner to select winner after time has passed", async function () {
      // Fast forward time
      await time.increase(60 * 60 + 1); // 60 minutes + 1 second
      
      await expect(nyContract.selectWinner())
        .to.emit(nyContract, "RaffleEnded");
      
      expect(await nyContract.raffleStatus()).to.equal(false);
      expect(await nyContract.getWinnerCount()).to.equal(1);
    });

    it("Should reject selecting winner if time has not passed", async function () {
      await expect(
        nyContract.selectWinner()
      ).to.be.revertedWith("Raffle is not yet ready to end.");
    });

    it("Should reject if raffle is still active and conditions not met", async function () {
      // Try to select winner while raffle is active and time hasn't passed
      await expect(
        nyContract.selectWinner()
      ).to.be.revertedWith("Raffle is not yet ready to end.");
    });
  });

  /**
   * Tests for contract administrative functions
   */
  describe("Contract Administration", function () {
    it("Should allow owner to deposit funds", async function () {
      const depositAmount = ethers.parseEther("5");
      
      await nyContract.deposit({ value: depositAmount });
      
      // Validate the deposit was successful
      expect(await nyContract.getContractBalance()).to.equal(depositAmount);
    });

    it("Should allow owner to withdraw balance when raffle is not active", async function () {
      // Deposit some funds first
      const depositAmount = ethers.parseEther("5");
      await nyContract.deposit({ value: depositAmount });
      
      // Withdraw all funds
      await nyContract.withdrawBalance();
      
      // Verify contract balance is 0 after withdrawal
      expect(await nyContract.getContractBalance()).to.equal(0);
    });

    it("Should reject withdrawal when raffle is active", async function () {
      // Setup a raffle
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      await expect(
        nyContract.withdrawBalance()
      ).to.be.revertedWith("Cannot withdraw before raffle has ended.");
    });

    it("Should allow owner to hard reset the raffle", async function () {
      // Setup a raffle
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      // Add some entries
      const numberOfEntries = 2n;
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n;
      
      await nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
      
      // Reset the raffle
      await nyContract.hardReset();
      
      expect(await nyContract.raffleStatus()).to.equal(false);
      expect(await nyContract.totalEntries()).to.equal(0);
    });
  });

  /**
   * Tests for view functions and contract state queries
   */
  describe("View Functions", function () {
    beforeEach(async function () {
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      // Buy entries
      const numberOfEntries = 2n;
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n;
      await nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
    });

    it("Should return correct prize pool", async function () {
      const entryFee = await nyContract.entryFee();
      const expectedPrizePool = entryFee * 2n; // 2 entries
      
      expect(await nyContract.getPrizePool()).to.equal(expectedPrizePool);
    });

    it("Should return correct total entries", async function () {
      expect(await nyContract.getTotalEntries()).to.equal(2n);
    });

    it("Should return correct remaining time", async function () {
      const remainingTimeSec = await nyContract.getRemainingTimeSec();
      expect(remainingTimeSec).to.be.gt(0);
      
      const remainingTimeMinutes = await nyContract.getRemainingTimeMinutes();
      expect(remainingTimeMinutes).to.be.gt(0);
      
      const remainingTimeHours = await nyContract.getRemainingTimeHours();
      expect(remainingTimeHours).to.be.gte(0);
    });

    it("Should return correct player info", async function () {
      // Test getPlayers
      const players = await nyContract.getPlayers();
      expect(players.length).to.equal(2); // 2 entries for addr1
      expect(players[0]).to.equal(addr1.address);
      expect(players[1]).to.equal(addr1.address);
      
      // Test getNumberOfTicketsPerPlayer
      expect(await nyContract.getNumberOfTicketsPerPlayer(addr1.address)).to.equal(2);
    });
  });
}); 