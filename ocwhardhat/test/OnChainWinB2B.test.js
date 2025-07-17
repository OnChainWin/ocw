/**
 * @title Test Suite for OnChainWinB2B Contract
 * @dev This suite tests the OnChainWinB2B contract, which operates on a fixed prize and required entries model.
 * It covers deployment, raffle setup, entry purchases, winner selection, and administrative functions.
 */
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OnChainWinB2B", function () {
  let b2bContract;
  let owner;
  let addr1;
  let addr2;

  /**
   * @dev Deploys a new instance of the OnChainWinB2B contract before each test.
   * This ensures a clean state for every test case.
   */
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const OnChainWinB2B = await ethers.getContractFactory("OnChainWinB2B");
    b2bContract = await OnChainWinB2B.deploy();
  });

  /**
   * @dev Tests related to the initial state of the contract upon deployment.
   */
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // @dev Verifies that the contract deployer is correctly set as the owner.
      expect(await b2bContract.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct default values", async function () {
      // @dev Checks that the raffle is initially inactive with zero total entries.
      expect(await b2bContract.raffleStatus()).to.equal(false);
      expect(await b2bContract.totalEntries()).to.equal(0);
    });
  });
  
  /**
   * @dev Tests the functionality of setting up a new raffle.
   */
  describe("Setting up Raffle", function () {
    it("Should allow the owner to set up a raffle", async function () {
      // @dev The contract must be funded before a raffle can be set up.
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      // @dev Define raffle parameters.
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      
      // @dev The owner sets up the raffle.
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      // @dev Verifies that the raffle parameters are set correctly.
      expect(await b2bContract.raffleStatus()).to.equal(true);
      expect(await b2bContract.fixedPrizeAmount()).to.equal(fixedPrizeAmount);
      expect(await b2bContract.requiredEntries()).to.equal(requiredEntries);
      expect(await b2bContract.entryFee()).to.equal(entryFee);
    });

    it("Should reject setup if a raffle is already in progress", async function () {
      // @dev Fund the contract and set up an initial raffle.
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      // @dev Attempting to set up a second raffle should be reverted.
      await expect(
        b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee)
      ).to.be.revertedWith("Raffle already in progress.");
    });

    it("Should reject setup if parameters are invalid", async function () {
      // @dev Fund the contract to test setup conditions.
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      
      // @dev Test with zero required entries, which is invalid.
      await expect(
        b2bContract.setupRaffle(ethers.parseEther("1"), 0, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Invalid required entries.");
      
      // @dev Test with a zero entry fee, which is invalid.
      await expect(
        b2bContract.setupRaffle(ethers.parseEther("1"), 10, 0)
      ).to.be.revertedWith("Invalid entry fee.");
      
      // @dev Test with a zero fixed prize, which is invalid.
      await expect(
        b2bContract.setupRaffle(0, 10, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Fixed prize must be greater than 0");
      
      // @dev Test with a prize amount greater than the contract's balance.
      await expect(
        b2bContract.setupRaffle(ethers.parseEther("20"), 10, ethers.parseEther("0.1"))
      ).to.be.revertedWith("Not enough contract balance for the fixed prize");
    });
  });
  
  /**
   * @dev Tests the functionality for users purchasing raffle entries.
   */
  describe("Buying Entries", function () {
    beforeEach(async function () {
      // @dev Fund the contract and set up a raffle for the tests.
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
    });

    it("Should allow a user to buy entries", async function () {
      // @dev A user buys multiple entries.
      const numberOfEntries = 2;
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n; // @dev Includes 5% commission.
      
      // @dev The purchase should emit a NewEntry event.
      await expect(b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost }))
        .to.emit(b2bContract, "NewEntry")
        .withArgs(addr1.address, numberOfEntries);
      
      // @dev Verifies the user's entry count and the total entries are updated.
      expect(await b2bContract.entryCount(addr1.address)).to.equal(numberOfEntries);
      expect(await b2bContract.totalEntries()).to.equal(numberOfEntries);
    });

    it("Should reject if payment is insufficient", async function () {
      // @dev A user attempts to buy entries without including the commission.
      const numberOfEntries = 2;
      const entryFee = await b2bContract.entryFee();
      const insufficientPayment = entryFee * BigInt(numberOfEntries);
      
      // @dev The transaction should be reverted due to incorrect payment.
      await expect(
        b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: insufficientPayment })
      ).to.be.revertedWith("You need to pay more.");
    });

    it("Should reject if the raffle is not active", async function () {
      // @dev Manually reset the raffle to make it inactive.
      await b2bContract.hardReset();
      
      const numberOfEntries = 2;
      const entryFee = ethers.parseEther("0.1");
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n;
      
      // @dev The purchase attempt should be reverted.
      await expect(
        b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost })
      ).to.be.revertedWith("Raffle has not started or finished yet.");
    });

    it("Should automatically end the raffle and select a winner when required entries are reached", async function () {
      // @dev Calculate the cost for all required entries.
      const requiredEntries = await b2bContract.requiredEntries();
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * requiredEntries * 105n) / 100n;
      
      // @dev Buying all required entries should trigger the automatic raffle end.
      await expect(b2bContract.connect(addr1).buyEntry(Number(requiredEntries), { value: totalCost }))
        .to.emit(b2bContract, "RaffleEnded");
      
      // @dev Verifies the raffle is inactive and a winner has been recorded.
      expect(await b2bContract.raffleStatus()).to.equal(false);
      expect(await b2bContract.getWinnerCount()).to.equal(1);
    });
  });
  
  /**
   * @dev Tests the winner selection process when the required number of entries is reached.
   */
  describe("Winner Selection", function () {
    beforeEach(async function () {
      // @dev Fund and set up a raffle, then add some entries.
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      // @dev Two different users buy entries.
      const numberOfEntries = 5;
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n;
      await b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
      await b2bContract.connect(addr2).buyEntry(1, { value: (entryFee * 105n) / 100n });
    });

    it("Should select a winner and distribute the prize when required entries are reached", async function () {
      // @dev Calculate the cost for the remaining entries to trigger the raffle end.
      const remainingEntries = await b2bContract.requiredEntries() - await b2bContract.totalEntries();
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * remainingEntries * 105n) / 100n;
      
      // @dev This purchase will trigger the automatic winner selection.
      const tx = await b2bContract.connect(addr1).buyEntry(Number(remainingEntries), { value: totalCost });
      const receipt = await tx.wait();
      
      // @dev Verifies that a winner has been recorded.
      expect(await b2bContract.getWinnerCount()).to.equal(1);
      
      // @dev Confirms that the RaffleEnded event was emitted.
      const raffleEndedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'RaffleEnded'
      );
      expect(raffleEndedEvent).to.not.be.undefined;
      
      // @dev Verifies that the raffle is no longer active.
      expect(await b2bContract.raffleStatus()).to.equal(false);
    });

    it("Should record the winner in the winners array", async function () {
      // @dev Buy the remaining entries to complete the raffle.
      const remainingEntries = await b2bContract.requiredEntries() - await b2bContract.totalEntries();
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * remainingEntries * 105n) / 100n;
      await b2bContract.connect(addr1).buyEntry(Number(remainingEntries), { value: totalCost });
      
      // @dev Verifies that a winner has been recorded.
      expect(await b2bContract.getWinnerCount()).to.equal(1);
    });

    it("Should reset the raffle state after selecting a winner", async function () {
      // @dev Complete the raffle by buying the remaining entries.
      const remainingEntries = await b2bContract.requiredEntries() - await b2bContract.totalEntries();
      const entryFee = await b2bContract.entryFee();
      const totalCost = (entryFee * remainingEntries * 105n) / 100n;
      await b2bContract.connect(addr1).buyEntry(Number(remainingEntries), { value: totalCost });
      
      // @dev Verifies that the raffle state is reset.
      expect(await b2bContract.raffleStatus()).to.equal(false);
      expect(await b2bContract.totalEntries()).to.equal(0);
      
      // @dev Verifies that player entry counts are cleared.
      expect(await b2bContract.entryCount(addr1.address)).to.equal(0);
      expect(await b2bContract.entryCount(addr2.address)).to.equal(0);
      
      // @dev Ensures a new raffle can be started, indicating a successful reset.
      await b2bContract.setupRaffle(ethers.parseEther("1"), 10, ethers.parseEther("0.1"));
      expect(await b2bContract.raffleStatus()).to.equal(true);
    });
  });
  
  /**
   * @dev Tests administrative functions like depositing funds and managing the raffle state.
   */
  describe("Contract Administration", function () {
    it("Should allow the owner to deposit funds", async function () {
      // @dev The owner deposits funds into the contract.
      const depositAmount = ethers.parseEther("5");
      await expect(
        b2bContract.initialDeposit({ value: depositAmount })
      ).to.not.be.reverted;
    });

    it("Should allow the owner to withdraw the balance when the raffle is not active", async function () {
      // @dev Fund the contract and then withdraw while the raffle is inactive.
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      await expect(
        b2bContract.withdrawBalance()
      ).to.not.be.reverted;
    });

    it("Should reject withdrawal when a raffle is active", async function () {
      // @dev Fund and set up a raffle to make it active.
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      // @dev Attempting to withdraw during an active raffle should be reverted.
      await expect(
        b2bContract.withdrawBalance()
      ).to.be.revertedWith("Cannot withdraw before raffle has ended.");
    });

    it("Should allow the owner to hard reset the raffle", async function () {
      // @dev Fund, set up a raffle, and add some entries.
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      const numberOfEntries = 2;
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n;
      await b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
      
      // @dev The owner forcibly resets the raffle.
      await b2bContract.hardReset();
      
      // @dev Verifies that the raffle is inactive and entries have been cleared.
      expect(await b2bContract.raffleStatus()).to.equal(false);
      expect(await b2bContract.totalEntries()).to.equal(0);
    });
  });
  
  /**
   * @dev Tests view functions that return contract state information.
   */
  describe("View Functions", function () {
    beforeEach(async function () {
      // @dev Fund, set up a raffle, and add entries to populate the state.
      await b2bContract.initialDeposit({ value: ethers.parseEther("10") });
      const fixedPrizeAmount = ethers.parseEther("1");
      const requiredEntries = 10;
      const entryFee = ethers.parseEther("0.1");
      await b2bContract.setupRaffle(fixedPrizeAmount, requiredEntries, entryFee);
      
      const numberOfEntries = 2;
      const totalCost = (entryFee * BigInt(numberOfEntries) * 105n) / 100n;
      await b2bContract.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
    });

    it("Should return the correct player information", async function () {
      // @dev Verifies that player data, including their entries, is retrievable.
      const players = await b2bContract.getPlayers();
      expect(players.length).to.equal(2);
      expect(players[0]).to.equal(addr1.address);
      expect(players[1]).to.equal(addr1.address);
      
      expect(await b2bContract.getNumberOfTicketsPerPlayer(addr1.address)).to.equal(2);
    });

    it("Should return the correct winner count", async function () {
      // @dev Verifies that the winner count is initially zero.
      expect(await b2bContract.getWinnerCount()).to.equal(0);
    });

    it("Should return the correct contract balance", async function () {
      // @dev Verifies that the contract balance includes the initial deposit and entry fees.
      const balance = await b2bContract.getContractBalance();
      expect(balance).to.be.gt(ethers.parseEther("10"));
    });
  });
}); 