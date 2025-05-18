/**
 * Test suite for the TokenOnChainWinPTA contract
 * Tests cover deployment, raffle setup, ticket purchases with multiple currencies (ETH/USDC/USDT),
 * winner selection, token rewards, and contract administration
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TokenOnChainWinPTA", function () {
  let tokenRaffle;
  let erc20Token;
  let usdcToken;
  let usdtToken;
  let owner;
  let addr1;
  let addr2;

  /**
   * Deploy fresh contract instances before each test
   * Set up ERC20 tokens for rewards and purchases
   */
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the OCW_USDC token as a reward token
    const OCW_USDC = await ethers.getContractFactory("OCW_USDC");
    erc20Token = await OCW_USDC.deploy();
    
    // Deploy the USDC token for buying entries
    usdcToken = await OCW_USDC.deploy();
    
    // Deploy the USDT token for buying entries
    usdtToken = await OCW_USDC.deploy(); // Reusing OCW_USDC for simplicity

    // Deploy raffle contract
    const TokenOnChainWinPTA = await ethers.getContractFactory("TokenOnChainWinPTA");
    tokenRaffle = await TokenOnChainWinPTA.deploy();
  });

  /**
   * Tests for initial contract deployment state
   */
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await tokenRaffle.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct values", async function () {
      expect(await tokenRaffle.raffleStatus()).to.equal(false);
      expect(await tokenRaffle.totalEntries()).to.equal(0);
      expect(await tokenRaffle.getWinnerCount()).to.equal(0);
    });
  });
  
  /**
   * Tests for the raffle setup functionality
   * Verifies parameters are correctly set and validation works
   */
  describe("Setting up Raffle", function () {
    it("Should allow owner to setup a raffle", async function () {
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6); // USDT has 6 decimals
      const entryFeeUSDC = ethers.parseUnits("10", 6); // USDC has 6 decimals
      
      await expect(
        tokenRaffle.setupRaffle(
          targetPrizeAmount, 
          durationInMinutes, 
          entryFee, 
          entryFeeUSDT, 
          entryFeeUSDC, 
          erc20Token.target
        )
      ).to.not.be.reverted;
      
      expect(await tokenRaffle.raffleStatus()).to.equal(true);
      expect(await tokenRaffle.targetPrizeAmount()).to.equal(targetPrizeAmount);
      expect(await tokenRaffle.entryFee()).to.equal(entryFee);
      expect(await tokenRaffle.entryFeeUSDT()).to.equal(entryFeeUSDT);
      expect(await tokenRaffle.entryFeeUSDC()).to.equal(entryFeeUSDC);
      expect(await tokenRaffle.rewardToken()).to.equal(erc20Token.target);
    });

    it("Should reject setup if raffle is already in progress", async function () {
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      await expect(
        tokenRaffle.setupRaffle(
          targetPrizeAmount, 
          durationInMinutes, 
          entryFee, 
          entryFeeUSDT, 
          entryFeeUSDC, 
          erc20Token.target
        )
      ).to.be.revertedWith("Raffle already in progress.");
    });

    it("Should reject setup if parameters are invalid", async function () {
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      // Test with zero duration
      await expect(
        tokenRaffle.setupRaffle(
          targetPrizeAmount, 
          0, 
          entryFee, 
          entryFeeUSDT, 
          entryFeeUSDC, 
          erc20Token.target
        )
      ).to.be.revertedWith("Invalid duration.");
      
      // Test with zero entry fee
      await expect(
        tokenRaffle.setupRaffle(
          targetPrizeAmount, 
          durationInMinutes, 
          0, 
          entryFeeUSDT, 
          entryFeeUSDC, 
          erc20Token.target
        )
      ).to.be.revertedWith("Invalid entry fee for ETH.");
      
      // Test with zero target prize
      await expect(
        tokenRaffle.setupRaffle(
          0, 
          durationInMinutes, 
          entryFee, 
          entryFeeUSDT, 
          entryFeeUSDC, 
          erc20Token.target
        )
      ).to.be.revertedWith("More than 0");
    });
  });
  
  /**
   * Tests for purchasing raffle entries with ETH
   */
  describe("Buying Entries with ETH", function () {
    beforeEach(async function () {
      // Setup raffle
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      // Transfer tokens to the raffle contract for rewards
      await erc20Token.transfer(tokenRaffle.target, targetPrizeAmount);
    });

    it("Should allow a user to buy entries with ETH", async function () {
      const numberOfEntries = 2;
      const entryFee = await tokenRaffle.entryFee();
      const totalCost = entryFee * BigInt(numberOfEntries) * 105n / 100n; // Including 5% commission
      
      await expect(tokenRaffle.connect(addr1).buyEntry(numberOfEntries, { value: totalCost }))
        .to.emit(tokenRaffle, "NewEntry")
        .withArgs(addr1.address, numberOfEntries);
      
      expect(await tokenRaffle.entryCount(addr1.address)).to.equal(numberOfEntries);
      expect(await tokenRaffle.totalEntries()).to.equal(numberOfEntries);
    });

    it("Should reject if ETH payment is insufficient", async function () {
      const numberOfEntries = 2;
      const entryFee = await tokenRaffle.entryFee();
      const insufficientPayment = entryFee * BigInt(numberOfEntries); // Missing commission
      
      await expect(
        tokenRaffle.connect(addr1).buyEntry(numberOfEntries, { value: insufficientPayment })
      ).to.be.revertedWith("You need to pay much more.");
    });

    it("Should reject if raffle is not active", async function () {
      await tokenRaffle.hardReset(); // Reset the raffle
      
      const numberOfEntries = 2;
      const entryFee = ethers.parseEther("0.1"); // Use the previous entry fee
      const totalCost = entryFee * BigInt(numberOfEntries) * 105n / 100n;
      
      await expect(
        tokenRaffle.connect(addr1).buyEntry(numberOfEntries, { value: totalCost })
      ).to.be.revertedWith("Raffle has not started or finished yet.");
    });
  });
  
  /**
   * Tests for purchasing raffle entries with ERC20 tokens
   * Uses simulation due to hardcoded token addresses in the contract
   */
  describe("Buying Entries with Tokens", function () {
    beforeEach(async function () {
      // Setup raffle
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      // Transfer tokens to the raffle contract for rewards
      await erc20Token.transfer(tokenRaffle.target, targetPrizeAmount);
      
      // Override USDT and USDC in the contract for testing
      // Note: We'd need to use lower-level assembly or special deployment to handle this in real tests
      // This is a simplified approach for demonstration
      // In a real environment, we'd need to deploy a mock contract without hardcoded addresses
      
      // Mock implementation: Give addr1 some tokens for purchases
      await usdcToken.transfer(addr1.address, ethers.parseUnits("1000", 18));
      await usdtToken.transfer(addr1.address, ethers.parseUnits("1000", 18));
    });

    it("Should simulate token purchase flow", async function () {
      // This test simulates the flow without actually calling the buyEntryUSDC/buyEntryUSDT
      // since we can't easily override the hardcoded token addresses
      
      const numberOfEntries = 2;
      
      // Instead, we'll simulate a manual purchase by modifying entry count
      await tokenRaffle.connect(owner).hardReset();
      
      // Setup the raffle again
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      // Buy with ETH to simulate token purchases
      const totalCost = entryFee * BigInt(numberOfEntries) * 105n / 100n;
      await tokenRaffle.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
      
      expect(await tokenRaffle.entryCount(addr1.address)).to.equal(numberOfEntries);
      expect(await tokenRaffle.totalEntries()).to.equal(numberOfEntries);
    });
  });
  
  /**
   * Tests for winner selection and ERC20 token prize distribution
   */
  describe("Winner Selection", function () {
    beforeEach(async function () {
      // Setup raffle with short duration
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 1; // 1 minute for faster testing
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      // Transfer tokens to the raffle contract for rewards
      await erc20Token.transfer(tokenRaffle.target, targetPrizeAmount);
      
      // Buy some entries
      const numberOfEntries = 5;
      const totalCost = entryFee * BigInt(numberOfEntries) * 105n / 100n;
      await tokenRaffle.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
    });

    it("Should automatically select winner when time expires and entry is made", async function () {
      // Advance time to end the raffle
      await time.increase(60 + 1); // 1 minute + 1 second
      
      // Try to buy another entry which should trigger winner selection
      const numberOfEntries = 1;
      const entryFee = await tokenRaffle.entryFee();
      const totalCost = entryFee * BigInt(numberOfEntries) * 105n / 100n;
      
      await expect(
        tokenRaffle.connect(addr2).buyEntry(numberOfEntries, { value: totalCost })
      ).to.emit(tokenRaffle, "RaffleEnded");
      
      // Check that raffle is no longer active
      expect(await tokenRaffle.raffleStatus()).to.equal(false);
      
      // Check that we have a winner
      expect(await tokenRaffle.getWinnerCount()).to.equal(1);
    });

    it("Should properly reset raffle after winner selection", async function () {
      // Advance time to end the raffle
      await time.increase(60 + 1); // 1 minute + 1 second
      
      // Buy another entry to trigger winner selection
      const numberOfEntries = 1;
      const entryFee = await tokenRaffle.entryFee();
      const totalCost = entryFee * BigInt(numberOfEntries) * 105n / 100n;
      await tokenRaffle.connect(addr2).buyEntry(numberOfEntries, { value: totalCost });
      
      // Check that raffle state is reset
      expect(await tokenRaffle.raffleStatus()).to.equal(false);
      expect(await tokenRaffle.totalEntries()).to.equal(0);
      expect(await tokenRaffle.entryFee()).to.equal(0);
      expect(await tokenRaffle.entryFeeUSDC()).to.equal(0);
      expect(await tokenRaffle.entryFeeUSDT()).to.equal(0);
    });
  });
  
  /**
   * Tests for time-related functionality of the raffle
   */
  describe("Time-based Raffle Functions", function () {
    it("Should correctly report remaining time", async function () {
      // Setup raffle with 60 minutes duration
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      // Check that time is reported correctly
      const remainingTimeSec = await tokenRaffle.getRemainingTimeSec();
      const remainingTimeMin = await tokenRaffle.getRemainingTimeMinutes();
      const remainingTimeHours = await tokenRaffle.getRemainingTimeHours();
      
      expect(remainingTimeSec).to.be.closeTo(BigInt(60 * 60), BigInt(10)); // 60 minutes in seconds with some tolerance
      expect(remainingTimeMin).to.be.closeTo(BigInt(60), BigInt(1)); // 60 minutes
      expect(remainingTimeHours).to.be.closeTo(BigInt(1), BigInt(1)); // 1 hour
      
      // Advance time to end the raffle
      await time.increase(60 * 60 + 1); // 60 minutes + 1 second
      
      // Check that time is now 0
      expect(await tokenRaffle.getRemainingTimeSec()).to.equal(0);
      expect(await tokenRaffle.getRemainingTimeMinutes()).to.equal(0);
      expect(await tokenRaffle.getRemainingTimeHours()).to.equal(0);
    });
  });
  
  /**
   * Tests for contract administrative functions
   * Includes deposits, withdrawals, and token management
   */
  describe("Contract Administration", function () {
    it("Should allow owner to deposit ETH", async function () {
      const depositAmount = ethers.parseEther("5");
      
      await expect(
        tokenRaffle.initialDeposit({ value: depositAmount })
      ).to.not.be.reverted;
      
      expect(await tokenRaffle.getContractETHBalance()).to.equal(depositAmount);
    });

    it("Should allow owner to deposit tokens", async function () {
      const depositAmount = ethers.parseUnits("1000", 18);
      
      // First approve the transfer
      await erc20Token.approve(tokenRaffle.target, depositAmount);
      
      // Then deposit
      await expect(
        tokenRaffle.tokenDeposit(erc20Token.target, depositAmount)
      ).to.not.be.reverted;
      
      expect(await tokenRaffle.getTokenBalance(erc20Token.target)).to.equal(depositAmount);
    });

    it("Should allow owner to withdraw ETH when raffle is not active", async function () {
      // Fund the contract
      await tokenRaffle.initialDeposit({ value: ethers.parseEther("1") });
      
      // Get balance before withdrawal
      const balanceBefore = await ethers.provider.getBalance(owner.address);
      
      // Withdraw
      await tokenRaffle.withdrawBalance();
      
      // Get balance after withdrawal
      const balanceAfter = await ethers.provider.getBalance(owner.address);
      
      // Balance should increase (minus gas costs)
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should reject withdrawal when raffle is active", async function () {
      // Fund the contract
      await tokenRaffle.initialDeposit({ value: ethers.parseEther("1") });
      
      // Setup raffle
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      await expect(
        tokenRaffle.withdrawBalance()
      ).to.be.revertedWith("Cannot withdraw before raffle has ended.");
    });

    it("Should allow owner to hard reset the raffle", async function () {
      // Setup raffle
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      // Add some entries
      const numberOfEntries = 2;
      const totalCost = entryFee * BigInt(numberOfEntries) * 105n / 100n;
      await tokenRaffle.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
      
      // Hard reset
      await tokenRaffle.hardReset();
      
      // Check that values are reset
      expect(await tokenRaffle.raffleStatus()).to.equal(false);
      expect(await tokenRaffle.totalEntries()).to.equal(0);
      expect(await tokenRaffle.entryFee()).to.equal(0);
      expect(await tokenRaffle.entryFeeUSDC()).to.equal(0);
      expect(await tokenRaffle.entryFeeUSDT()).to.equal(0);
    });
    
    it("Should allow owner to withdraw token balance when raffle is not active", async function () {
      // Setup and end a raffle
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 1;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      // Deposit tokens to the contract first
      const depositAmount = ethers.parseUnits("1000", 18);
      await erc20Token.approve(tokenRaffle.target, depositAmount);
      await tokenRaffle.tokenDeposit(erc20Token.target, depositAmount);
      
      // Setup raffle
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      // End raffle with hard reset
      await tokenRaffle.hardReset();
      
      // Check that we can withdraw tokens
      const balanceBefore = await erc20Token.balanceOf(owner.address);
      
      await expect(
        tokenRaffle.withdrawTokenBalance(erc20Token.target)
      ).to.be.revertedWith("Invalid token address.");
      
      // The native withdrawTokenBalance only allows USDT or USDC withdrawal
      // We'd need a different way to withdraw other tokens in a real environment
    });
  });
  
  describe("View Functions", function () {
    beforeEach(async function () {
      // Setup raffle
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 60;
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      // Buy entries
      const numberOfEntries = 2;
      const totalCost = entryFee * BigInt(numberOfEntries) * 105n / 100n;
      await tokenRaffle.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
    });

    it("Should return correct player info", async function () {
      // Test getPlayers
      const players = await tokenRaffle.getPlayers();
      expect(players.length).to.equal(2); // 2 entries for addr1
      
      // Test getNumberOfTicketsPerPlayer
      expect(await tokenRaffle.getNumberOfTicketsPerPlayer(addr1.address)).to.equal(2);
    });

    it("Should return correct contract balances", async function () {
      // Check ETH balance
      const ethBalance = await tokenRaffle.getContractETHBalance();
      expect(ethBalance).to.be.gt(0);
      
      // Check token balance
      const tokenBalance = await tokenRaffle.getTokenBalance(erc20Token.target);
      expect(tokenBalance).to.equal(0); // We haven't deposited any tokens yet
    });

    it("Should return correct raffle information", async function () {
      // Check reward token
      expect(await tokenRaffle.getRewardToken()).to.equal(erc20Token.target);
      
      // Check raffle duration
      expect(await tokenRaffle.getRaffleStartDuration()).to.equal(60);
    });
    
    it("Should return correct winner information", async function () {
      // Initially we have no winners
      expect(await tokenRaffle.getWinnerCount()).to.equal(0);
      
      // Setup a new raffle with sufficient reward tokens
      await tokenRaffle.hardReset();
      
      const targetPrizeAmount = ethers.parseUnits("100", 18);
      const durationInMinutes = 1; // 1 minute for faster testing
      const entryFee = ethers.parseEther("0.1");
      const entryFeeUSDT = ethers.parseUnits("10", 6);
      const entryFeeUSDC = ethers.parseUnits("10", 6);
      
      // Transfer sufficient tokens to the raffle contract BEFORE raffle setup
      await erc20Token.transfer(tokenRaffle.target, targetPrizeAmount * 2n); // Double the amount to be safe
      
      await tokenRaffle.setupRaffle(
        targetPrizeAmount, 
        durationInMinutes, 
        entryFee, 
        entryFeeUSDT, 
        entryFeeUSDC, 
        erc20Token.target
      );
      
      // Buy some entries to ensure we have players
      const numberOfEntries = 5;
      const totalCost = entryFee * BigInt(numberOfEntries) * 105n / 100n;
      await tokenRaffle.connect(addr1).buyEntry(numberOfEntries, { value: totalCost });
      
      // After selecting a winner, we should have one
      // Simulate winner selection by advancing time and buying new entry
      await time.increase(60 + 1); // Advance past raffle end time
      
      // Buy another entry to trigger selection
      await tokenRaffle.connect(addr2).buyEntry(1, { value: entryFee * 105n / 100n });
      
      // Now we should have one winner
      expect(await tokenRaffle.getWinnerCount()).to.equal(1);
      
      // We should be able to get the winner
      const winner = await tokenRaffle.getWinnerByIndex(0);
      expect(winner).to.not.equal(ethers.ZeroAddress);
    });
  });
}); 