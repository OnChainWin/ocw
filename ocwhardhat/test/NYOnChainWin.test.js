/**
 * @title Test Suite for NYOnChainWin Contract
 * @dev This suite tests the NYOnChainWin contract, which manages raffles with a target prize pool.
 * It covers deployment, raffle setup, entry purchases, winner selection, and administrative functions.
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
   * @dev Deploys a new instance of the NYOnChainWin contract before each test.
   * This ensures a clean state for every test case.
   */
  beforeEach(async function () {
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    const NYOnChainWin = await ethers.getContractFactory("NYOnChainWin");
    nyContract = await NYOnChainWin.deploy();
  });

  /**
   * @dev Tests related to the initial state of the contract upon deployment.
   */
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // @dev Verifies that the contract deployer is correctly set as the owner.
      expect(await nyContract.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct default values", async function () {
      // @dev Checks that the raffle is initially inactive, with zero entries and an empty prize pool.
      expect(await nyContract.raffleStatus()).to.equal(false);
      expect(await nyContract.totalEntries()).to.equal(0);
      expect(await nyContract.prizePool()).to.equal(0);
    });
  });

  /**
   * @dev Tests the functionality of setting up a new raffle.
   */
  describe("Setting up Raffle", function () {
    it("Should allow the owner to set up a raffle", async function () {
      // @dev Define raffle parameters.
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      
      // @dev The owner sets up the raffle, which should emit a RaffleStarted event.
      await expect(nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee))
        .to.emit(nyContract, "RaffleStarted");
      
      // @dev Verifies that the raffle parameters are set correctly.
      expect(await nyContract.raffleStatus()).to.equal(true);
      expect(await nyContract.targetPrizeAmount()).to.equal(targetPrizeAmount);
      expect(await nyContract.entryFee()).to.equal(entryFee);
    });

    it("Should reject setup if a raffle is already in progress", async function () {
      // @dev Set up an initial raffle.
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      // @dev Attempting to set up a second raffle should be reverted.
      await expect(
        nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee)
      ).to.be.revertedWith("Raffle already in progress.");
    });

    it("Should reject setup if parameters are invalid", async function () {
      // @dev Test with a zero target prize amount, which is invalid.
      await expect(
        nyContract.setupRaffle(0, 60, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Invalid entry fee.");
      
      // @dev Test with a zero duration, which is invalid.
      await expect(
        nyContract.setupRaffle(ethers.parseEther("1"), 0, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Invalid duration.");
      
      // @dev Test with a zero entry fee, which is invalid.
      await expect(
        nyContract.setupRaffle(ethers.parseEther("1"), 60, 0)
      ).to.be.revertedWith("Invalid entry fee.");
    });
  });

  /**
   * @dev Tests the functionality for users purchasing raffle entries.
   */
  describe("Buying Entries", function () {
    beforeEach(async function () {
      // @dev Set up a raffle to be used in the tests.
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
    });

    it("Should allow a user to buy entries", async function () {
      // @dev A user buys multiple entries.
      const numberOfEntries = 2n;
      const entryFee = await nyContract.entryFee();
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n; // @dev Includes 5% commission.
      
      // @dev The purchase should emit a NewEntry event.
      await expect(nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost }))
        .to.emit(nyContract, "NewEntry")
        .withArgs(addr1.address, numberOfEntries);
      
      // @dev Verifies the user's entry count and the total entries are updated.
      expect(await nyContract.entryCount(addr1.address)).to.equal(numberOfEntries);
      expect(await nyContract.totalEntries()).to.equal(numberOfEntries);
      
      // @dev The prize pool should increase by the base entry fee amount.
      const expectedPrizePool = entryFee * numberOfEntries;
      expect(await nyContract.prizePool()).to.equal(expectedPrizePool);
    });

    it("Should reject if payment is insufficient", async function () {
      // @dev A user attempts to buy entries without including the commission.
      const numberOfEntries = 2n;
      const entryFee = await nyContract.entryFee();
      const insufficientPayment = entryFee * numberOfEntries;
      
      // @dev The transaction should be reverted due to incorrect payment.
      await expect(
        nyContract.connect(addr1).buyEntry(numberOfEntries, { value: insufficientPayment })
      ).to.be.revertedWith("You need to pay much more.");
    });

    it("Should reject if the raffle is not active", async function () {
      // @dev Manually reset the raffle to make it inactive.
      await nyContract.hardReset();
      
      const numberOfEntries = 2n;
      const entryFee = ethers.parseEther("0.1");
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n;
      
      // @dev The purchase attempt should be reverted.
      await expect(
        nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost })
      ).to.be.revertedWith("Raffle has not started or finished yet.");
    });

    it("Should automatically end the raffle and select a winner when the target prize is reached", async function () {
      // @dev Calculate the number of entries needed to meet the target prize.
      const targetPrizeAmount = await nyContract.targetPrizeAmount();
      const entryFee = await nyContract.entryFee();
      const entriesNeeded = (targetPrizeAmount * 100n) / (entryFee * 105n) + 1n; // @dev +1 to ensure the target is exceeded.
      
      // @dev Buy enough entries to trigger the automatic raffle end.
      const totalCost = (entryFee * entriesNeeded * 105n) / 100n;
      
      // @dev The transaction should emit a RaffleEnded event.
      await expect(nyContract.connect(addr1).buyEntry(entriesNeeded, { value: totalCost }))
        .to.emit(nyContract, "RaffleEnded");
      
      // @dev Verifies that the raffle is no longer active.
      expect(await nyContract.raffleStatus()).to.equal(false);
    });
  });

  /**
   * @dev Tests the winner selection process.
   */
  describe("Selecting Winner", function () {
    beforeEach(async function () {
      // @dev Set up a raffle and add some entries.
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      const numberOfEntries = 5n;
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n;
      await nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
    });

    it("Should allow the owner to select a winner after the time has passed", async function () {
      // @dev Advance blockchain time to simulate the end of the raffle period.
      await time.increase(60 * 60 + 1);
      
      // @dev The owner selects the winner, which should emit a RaffleEnded event.
      await expect(nyContract.selectWinner())
        .to.emit(nyContract, "RaffleEnded");
      
      // @dev Verifies the raffle is inactive and a winner has been recorded.
      expect(await nyContract.raffleStatus()).to.equal(false);
      expect(await nyContract.getWinnerCount()).to.equal(1);
    });

    it("Should reject selecting a winner if the time has not passed", async function () {
      // @dev Attempting to select a winner before the duration expires should be reverted.
      await expect(
        nyContract.selectWinner()
      ).to.be.revertedWith("Raffle is not yet ready to end.");
    });

    it("Should reject if the raffle is still active and conditions for ending are not met", async function () {
      // @dev Attempting to select a winner prematurely should be reverted.
      await expect(
        nyContract.selectWinner()
      ).to.be.revertedWith("Raffle is not yet ready to end.");
    });
  });

  /**
   * @dev Tests administrative functions like depositing funds and managing the raffle state.
   */
  describe("Contract Administration", function () {
    it("Should allow the owner to deposit funds", async function () {
      // @dev The owner deposits funds into the contract.
      const depositAmount = ethers.parseEther("5");
      await nyContract.deposit({ value: depositAmount });
      
      // @dev Verifies that the contract balance has increased by the deposit amount.
      expect(await nyContract.getContractBalance()).to.equal(depositAmount);
    });

    it("Should allow the owner to withdraw the balance when the raffle is not active", async function () {
      // @dev Deposit funds and then withdraw them while the raffle is inactive.
      const depositAmount = ethers.parseEther("5");
      await nyContract.deposit({ value: depositAmount });
      await nyContract.withdrawBalance();
      
      // @dev Verifies that the contract balance is zero after withdrawal.
      expect(await nyContract.getContractBalance()).to.equal(0);
    });

    it("Should reject withdrawal when a raffle is active", async function () {
      // @dev Set up a raffle to make it active.
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      // @dev Attempting to withdraw during an active raffle should be reverted.
      await expect(
        nyContract.withdrawBalance()
      ).to.be.revertedWith("Cannot withdraw before raffle has ended.");
    });

    it("Should allow the owner to hard reset the raffle", async function () {
      // @dev Set up a raffle and add some entries.
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      const numberOfEntries = 2n;
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n;
      await nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
      
      // @dev The owner forcibly resets the raffle.
      await nyContract.hardReset();
      
      // @dev Verifies that the raffle is inactive and entries have been cleared.
      expect(await nyContract.raffleStatus()).to.equal(false);
      expect(await nyContract.totalEntries()).to.equal(0);
    });
  });

  /**
   * @dev Tests view functions that return contract state information.
   */
  describe("View Functions", function () {
    beforeEach(async function () {
      // @dev Set up a raffle and add entries to populate the state.
      const targetPrizeAmount = ethers.parseEther("1");
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      await nyContract.setupRaffle(targetPrizeAmount, durationInMinutes, entryFee);
      
      const numberOfEntries = 2n;
      const totalCost = (entryFee * numberOfEntries * 105n) / 100n;
      await nyContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
    });

    it("Should return the correct prize pool", async function () {
      // @dev Verifies that the prize pool reflects the accumulated entry fees.
      const entryFee = await nyContract.entryFee();
      const expectedPrizePool = entryFee * 2n;
      expect(await nyContract.getPrizePool()).to.equal(expectedPrizePool);
    });

    it("Should return the correct total number of entries", async function () {
      // @dev Verifies that the total entry count is accurate.
      expect(await nyContract.getTotalEntries()).to.equal(2n);
    });

    it("Should return the correct remaining time", async function () {
      // @dev Checks that the remaining time is reported correctly in seconds, minutes, and hours.
      const remainingTimeSec = await nyContract.getRemainingTimeSec();
      expect(remainingTimeSec).to.be.gt(0);
      
      const remainingTimeMinutes = await nyContract.getRemainingTimeMinutes();
      expect(remainingTimeMinutes).to.be.gt(0);
      
      const remainingTimeHours = await nyContract.getRemainingTimeHours();
      expect(remainingTimeHours).to.be.gte(0);
    });

    it("Should return the correct player information", async function () {
      // @dev Verifies that player data, including their entries, is retrievable.
      const players = await nyContract.getPlayers();
      expect(players.length).to.equal(2);
      expect(players[0]).to.equal(addr1.address);
      expect(players[1]).to.equal(addr1.address);
      
      expect(await nyContract.getNumberOfTicketsPerPlayer(addr1.address)).to.equal(2);
    });
  });
}); 