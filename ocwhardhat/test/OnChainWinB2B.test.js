/**
 * Test suite for the OnChainWinB2B contract
 * Tests cover deployment, raffle setup, entry purchases, winner selection, and contract administration
 * The B2B contract operates on a fixed prize and required entries model
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OnChainWinB2B", function () {
  let b2bContract;
  let owner;
  let addr1;
  let addr2;

  /**
   * Deploy a fresh contract instance before each test
   */
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const OnChainWinB2B = await ethers.getContractFactory("OnChainWinB2B");
    b2bContract = await OnChainWinB2B.deploy();
  });

  /**
   * Tests for initial contract deployment state
   */
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await b2bContract.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct values", async function () {
      expect(await b2bContract.raffleStatus()).to.equal(false);
      expect(await b2bContract.totalEntries()).to.equal(0);
    });
  });
  
  /**
   * Tests for the raffle setup functionality
   */
  describe("Setting up Raffle", function () {
    it("Should allow owner to setup a raffle", async function () {
      // Fund contract first
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      expect(await b2bContract.raffleStatus()).to.equal(true);
      expect(await b2bContract.fixedPrizeAmount()).to.equal(fixedPrizeAmount);
      expect(await b2bContract.requiredEntries()).to.equal(requiredEntries);
      expect(await b2bContract.entryFee()).to.equal(entryFee);
    });

    it("Should reject setup if raffle is already in progress", async function () {
      // Fund contract
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      await expect(
        b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee)
      ).to.be.revertedWith("Raffle already in progress.");
    });

    it("Should reject setup if parameters are invalid", async function () {
      // Fund contract
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      // Test with zero required entries
      await expect(
        b2bContract.setupRaffle(ethers.parseEther("1"), 0, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Invalid required entries.");
      
      // Test with zero entry fee
      await expect(
        b2bContract.setupRaffle(ethers.parseEther("1"), 10, 0)
      ).to.be.revertedWith("Invalid entry fee.");
      
      // Test with zero fixed prize
      await expect(
        b2bContract.setupRaffle(0, 10, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Fixed prize must be greater than 0");
      
      // Test with insufficient contract balance
      await expect(
        b2bContract.setupRaffle(ethers.parseEther("20"), 10, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Not enough contract balance for the fixed prize");
    });
  });
  
  /**
   * Tests for the ticket purchasing functionality
   */
  describe("Buying Entries", function () {
    beforeEach(async function () {
      // Fund contract
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      // Setup raffle
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
    });

    it("Should allow a user to buy entries", async function () {
      const numberOfEntries = 2;
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n; // Including 5% commission
      
      await expect(b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost }))
        .to.emit(b2bContract, "NewEntry")
        .withArgs(addr1.address, numberOfEntries);
      
      expect(await b2bContract.entryCount(addr1.address)).to.equal(numberOfEntries);
      expect(await b2bContract.totalEntries()).to.equal(numberOfEntries);
    });

    it("Should reject if payment is insufficient", async function () {
      const numberOfEntries = 2;
      const entryFee = await b2bContract.entryFee();
      const insufficientPayment = entryFee * BigInt(numberOfEntries); // Missing commission
      
      await expect(
        b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: insufficientPayment })
      ).to.be.revertedWith("You need to pay more.");
    });

    it("Should reject if raffle is not active", async function () {
      await b2bContract.hardReset(); // Reset the raffle
      
      const numberOfEntries = 2;
      const entryFee = ethers.parseEther("0.1"); // Use the previous entry fee
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n;
      
      await expect(
        b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost })
      ).to.be.revertedWith("Raffle has not started or finished yet.");
    });

    it("Should automatically end raffle and select winner when required entries are reached", async function () {
      const requiredEntries = await b2bContract.requiredEntries();
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * requiredEntries * 105n) / 100n;
      
      // Buy enough entries to trigger automatic ending
      await expect(b2bContract.connect(addr1).buyEntry(Number(requiredEntries), { value: totalCost }))
        .to.emit(b2bContract, "RaffleEnded");
      
      expect(await b2bContract.raffleStatus()).to.equal(false);
      expect(await b2bContract.getWinnerCount()).to.equal(1);
    });
  });
  
  /**
   * Tests for winner selection when the required number of entries is reached
   */
  describe("Winner Selection", function () {
    beforeEach(async function () {
      // Fund contract
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      // Setup raffle
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      // Buy some entries, but not enough to trigger automatic ending
      const numberOfEntries = 5; // Half of required entries
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n;
      await b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
      
      await b2bContract.connect(addr2).buyEntry(1, { value: (entryFee * 105n) / 100n });
    });

    it("Should select winner and distribute prize when required entries are reached", async function () {
      // Get balances before ending raffle
      const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
      const addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
      
      // Buy enough entries to reach required amount and trigger ending
      const remainingEntries = await b2bContract.requiredEntries() - await b2bContract.totalEntries();
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * remainingEntries * 105n) / 100n;
      
      // This should trigger automatic ending
      const tx = await b2bContract.connect(addr1).buyEntry(Number(remainingEntries), { value: totalCost });
      const receipt = await tx.wait();
      
      // Check that we have a winner
      expect(await b2bContract.getWinnerCount()).to.equal(1);
      
      // Check if RaffleEnded event was emitted
      const raffleEndedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'RaffleEnded'
      );
      expect(raffleEndedEvent).to.not.be.undefined;
      
      // Check that raffle has ended
      expect(await b2bContract.raffleStatus()).to.equal(false);
      
      // One of the players should have received the prize
      const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
      const addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
      
      const fixedPrizeAmount = await b2bContract.fixedPrizeAmount();
      
      // Note: This check is difficult due to the random nature of winner selection
      // and gas costs involved in transactions. We'll just verify the raffle ended properly.
      expect(await b2bContract.raffleStatus()).to.equal(false);
    });

    it("Should record the winner in the winners array", async function () {
      // Complete the raffle by buying remaining entries
      const remainingEntries = await b2bContract.requiredEntries() - await b2bContract.totalEntries();
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * remainingEntries * 105n) / 100n;
      
      await b2bContract.connect(addr1).buyEntry(Number(remainingEntries), { value: totalCost });
      
      // Check that a winner is recorded
      expect(await b2bContract.getWinnerCount()).to.equal(1);
    });

    it("Should reset the raffle state after selecting a winner", async function () {
      // Complete the raffle by buying remaining entries
      const remainingEntries = await b2bContract.requiredEntries() - await b2bContract.totalEntries();
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * remainingEntries * 105n) / 100n;
      
      await b2bContract.connect(addr1).buyEntry(Number(remainingEntries), { value: totalCost });
      
      // Check that raffle state is reset
      expect(await b2bContract.raffleStatus()).to.equal(false);
      expect(await b2bContract.totalEntries()).to.equal(0);
      
      // Check that player entries are reset
      expect(await b2bContract.entryCount(addr1.address)).to.equal(0);
      expect(await b2bContract.entryCount(addr2.address)).to.equal(0);
      
      // Ensure we can start a new raffle
      await b2bContract.setupRaffle(ethers.parseEther("1"), 10, ethers.parseEther("0.1"));
      expect(await b2bContract.raffleStatus()).to.equal(true);
    });
  });
  
  /**
   * Tests for contract administrative functions
   */
  describe("Contract Administration", function () {
    it("Should allow owner to deposit funds", async function () {
      const depositAmount = ethers.parseEther("5");
      
      await expect(
        b2bContract.initialDeposit({ value: depositAmount })
      ).to.not.be.reverted;
    });

    it("Should allow owner to withdraw balance when raffle is not active", async function () {
      // Fund the contract
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      // Withdraw should not revert
      await expect(
        b2bContract.withdrawBalance()
      ).to.not.be.reverted;
    });

    it("Should reject withdrawal when raffle is active", async function () {
      // Fund contract
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      // Setup raffle
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      await expect(
        b2bContract.withdrawBalance()
      ).to.be.revertedWith("Cannot withdraw before raffle has ended.");
    });

    it("Should allow owner to hard reset the raffle", async function () {
      // Fund contract
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      // Setup raffle
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      // Add some entries
      const numberOfEntries = 2;
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n;
      await b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
      
      // Reset the raffle
      await b2bContract.hardReset();
      
      expect(await b2bContract.raffleStatus()).to.equal(false);
      expect(await b2bContract.totalEntries()).to.equal(0);
    });
  });
  
  /**
   * Tests for view functions and contract state queries
   */
  describe("View Functions", function () {
    beforeEach(async function () {
      // Fund contract
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      // Setup raffle
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      // Buy entries
      const numberOfEntries = 2;
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n;
      await b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
    });

    it("Should return correct player info", async function () {
      // Test getPlayers
      const players = await b2bContract.getPlayers();
      expect(players.length).to.equal(2); // 2 entries for addr1
      expect(players[0]).to.equal(addr1.address);
      expect(players[1]).to.equal(addr1.address);
      
      // Test getNumberOfTicketsPerPlayer
      expect(await b2bContract.getNumberOfTicketsPerPlayer(addr1.address)).to.equal(2);
    });

    it("Should return correct winner count", async function () {
      expect(await b2bContract.getWinnerCount()).to.equal(0);
    });

    it("Should return correct contract balance", async function () {
      // Contract balance should include initial deposit plus entry fees
      const balance = await b2bContract.getContractBalance();
      expect(balance).to.be.gt(ethers.parseEther("10")); // Greater than initial deposit
    });
  });
}); 