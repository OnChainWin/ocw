const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

/**
 * @dev Audit Test Suite for FreeTimerOnChainSelectWinnerCount contract
 * @notice Covers deployment, lifecycle, Chainlink VRF, upkeep, edge cases, and batch logic.
 */
describe("FreeTimerOnChainSelectWinnerCount Audit Test", function () {
  let freeTimerContract, vrfCoordinatorV2PlusMock;
  let owner, addr1, addr2, addr3;
  let subscriptionId;
  const HARDCODED_VRF_COORDINATOR =
    "0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634";
  let snapshotId;

  /**
   * @dev Directly sets the ETH balance of the contract for test funding
   * @param {string} amount - Amount in ETH to fund
   */
  async function fundContract(amount = "10") {
    await network.provider.send("hardhat_setBalance", [
      await freeTimerContract.getAddress(),
      ethers.toQuantity(ethers.parseEther(amount)),
    ]);
  }

  /**
   * @dev Deploys contracts, sets up VRF mocks, impersonates coordinator, and snapshots state before all tests
   */
  before(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    /** @dev Impersonate the hardcoded VRF coordinator address */
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [HARDCODED_VRF_COORDINATOR],
    });
    const hardcodedSigner = await ethers.getSigner(HARDCODED_VRF_COORDINATOR);

    /** @dev Fund the impersonated VRF coordinator account */
    await network.provider.send("hardhat_setBalance", [
      HARDCODED_VRF_COORDINATOR,
      ethers.toQuantity(ethers.parseEther("100")),
    ]);

    /** @dev Deploy the mock VRF coordinator implementation */
    const VRFCoordinatorV2PlusMockFactory = await ethers.getContractFactory(
      "VRFCoordinatorV2PlusMock",
      hardcodedSigner
    );
    const mockImplementation = await VRFCoordinatorV2PlusMockFactory.deploy(
      0 /* baseFee */,
      0 /* gasPriceLink */
    );

    /** @dev Replace the code at the hardcoded address with the mock's code */
    await network.provider.send("hardhat_setCode", [
      HARDCODED_VRF_COORDINATOR,
      await ethers.provider.getCode(mockImplementation.target),
    ]);

    /** @dev Get a contract instance at the hardcoded address, now pointing to our mock logic */
    vrfCoordinatorV2PlusMock = await ethers.getContractAt(
      "VRFCoordinatorV2PlusMock",
      HARDCODED_VRF_COORDINATOR
    );

    /** @dev Create and fund VRF subscription using the impersonated signer */
    const tx = await vrfCoordinatorV2PlusMock
      .connect(hardcodedSigner)
      .createSubscription();
    const receipt = await tx.wait();
    subscriptionId = receipt.logs[0].args.subId;
    await vrfCoordinatorV2PlusMock
      .connect(hardcodedSigner)
      .fundSubscription(subscriptionId, ethers.parseEther("10"));

    /** @dev Deploy the main contract */
    const FreeTimerFactory = await ethers.getContractFactory(
      "FreeTimerOnChainSelectWinnerCount"
    );
    freeTimerContract = await FreeTimerFactory.deploy(subscriptionId);
    await freeTimerContract.waitForDeployment();

    /** @dev Add the contract as a consumer to the VRF subscription */
    await vrfCoordinatorV2PlusMock
      .connect(hardcodedSigner)
      .addConsumer(subscriptionId, await freeTimerContract.getAddress());

    /** @dev Take a snapshot of the state after the initial dev */
    snapshotId = await network.provider.send("evm_snapshot", []);
  });

  /**
   * @dev Reverts to snapshot before each test for isolation
   */
  beforeEach(async function () {
    await network.provider.send("evm_revert", [snapshotId]);
    snapshotId = await network.provider.send("evm_snapshot", []);
  });

  /**
   * @dev Tests for correct deployment and initial state variables
   */
  describe("Deployment & Initial State", function () {
    /**
     * @dev Ensures contract owner is set correctly
     */
    it("Should set the correct owner", async function () {
      expect(await freeTimerContract.raffleOwner()).to.equal(owner.address);
    });

    /**
     * @dev Checks VRF subscription ID is set and accessible
     */
    it("Should initialize with correct VRF parameters", async function () {
      /** @dev We can't directly check the VRF coordinator address as it's an internal variable.
      Its correct functionality is implicitly tested by the upkeep and fulfillment tests. */

      /** @dev Get the subscription ID from our custom getter */
      const [, , , subIdFromContract] = await freeTimerContract.getVRFStatus();
      expect(subIdFromContract).to.equal(subscriptionId);
    });

    /**
     * @dev Ensures raffleStatus is false after deployment
     */
    it("Should start with raffleStatus as false", async function () {
      expect(await freeTimerContract.raffleStatus()).to.be.false;
    });
  });

  /**
   * @dev Tests for raffle start, entry, and ticket logic
   */
  describe("Raffle Lifecycle", function () {
    /**
     * @dev The global beforeEach handles contract state, so we only need to fund it here.
     */
    beforeEach(async () => await fundContract("5"));

    /**
     * @dev Owner can start a raffle, emits RaffleStarted
     */
    it("Should allow owner to start a raffle", async function () {
      const prize = ethers.parseEther("1");
      const durationInMinutes = 1;
      const winners = 2;
      const maxParticipants = 10;

      const tx = await freeTimerContract.startRaffle(
        prize,
        durationInMinutes,
        winners,
        maxParticipants
      );
      const block = await ethers.provider.getBlock(tx.blockNumber);
      const expectedEndTime =
        BigInt(block.timestamp) + BigInt(durationInMinutes * 60);

      await expect(tx)
        .to.emit(freeTimerContract, "RaffleStarted")
        .withArgs(
          prize,
          (endTime) => {
            expect(endTime).to.be.closeTo(expectedEndTime, 5);
            return true;
          },
          winners,
          maxParticipants
        );
      expect(await freeTimerContract.raffleStatus()).to.be.true;
    });

    /**
     * @dev Users can get a single free ticket, emits NewEntry
     */
    it("Should allow users to get a free ticket", async function () {
      await freeTimerContract.startRaffle(ethers.parseEther("1"), 60, 1, 10);
      await expect(freeTimerContract.connect(addr1).getFreeTicket())
        .to.emit(freeTimerContract, "NewEntry")
        .withArgs(addr1.address, anyValue);
      expect(await freeTimerContract.hasEntered(addr1.address)).to.be.true;
    });

    /**
     * @dev Prevents double entry for same address
     */
    it("Should prevent getting a second ticket", async function () {
      await freeTimerContract.startRaffle(ethers.parseEther("1"), 60, 1, 10);
      await freeTimerContract.connect(addr1).getFreeTicket();
      await expect(
        freeTimerContract.connect(addr1).getFreeTicket()
      ).to.be.revertedWith("You have already claimed your free ticket.");
    });
  });

  /**
   * @dev Tests Chainlink Automation upkeep logic and time-based triggers
   */
  describe("Chainlink Automation (Upkeep)", function () {
    beforeEach(async () => {
      await fundContract("5");
      await freeTimerContract.startRaffle(ethers.parseEther("1"), 2, 2, 10);
      await freeTimerContract.connect(addr1).getFreeTicket();
      await freeTimerContract.connect(addr2).getFreeTicket();
      await freeTimerContract.connect(addr3).getFreeTicket();
    });

    /**
     * @dev Upkeep is not needed before raffle time expires
     */
    it("checkUpkeep should be false before time expires", async function () {
      const { upkeepNeeded } = await freeTimerContract.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.false;
    });

    /**
     * @dev Upkeep is needed after raffle time expires
     */
    it("checkUpkeep should be true after time expires", async function () {
      await time.increase(121);
      await network.provider.send("evm_mine", []);
      const { upkeepNeeded } = await freeTimerContract.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.true;
    });

    /**
     * @dev Upkeep is not needed immediately after starting raffle
     */
    it("should not need upkeep right after starting", async function () {
      const { upkeepNeeded } = await freeTimerContract.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.false;
    });
  });

  /**
   * @dev Tests full raffle cycle including VRF randomness and winner selection
   */
  describe("VRF & Winner Selection", function () {
    /**
     * @dev Runs a full raffle cycle, triggers VRF, verifies winners and payouts
     * @notice Simulates max participants triggering VRF and winner selection
     */
    it("Should correctly run the full cycle by reaching max participants", async function () {
      /** @dev This test runs the full, successful raffle lifecycle by triggering the VRF
      via the contract's intended max-participant logic, avoiding a direct call to performUpkeep. */
      await fundContract("5");
      /** @dev Start a raffle with a max participant count of 3. */
      await freeTimerContract.startRaffle(ethers.parseEther("2"), 5, 2, 3);

      /** @dev Two participants join. */
      await freeTimerContract.connect(addr1).getFreeTicket();
      await freeTimerContract.connect(addr2).getFreeTicket();

      /** @dev The third participant joins, reaching the cap and triggering the VRF request automatically. */
      const tx = await freeTimerContract.connect(addr3).getFreeTicket();
      const receipt = await tx.wait();

      /** @dev Verify that randomness was requested. */
      const requestedEvent = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "RandomnessRequested"
      );
      const requestId = requestedEvent.args[0];
      expect(requestId).to.not.be.undefined;

      /** @dev 3. VRF fulfillment selects winners. */
      const participants = [addr1, addr2, addr3];
      const balancesBefore = new Map();
      for (const p of participants) {
        balancesBefore.set(
          p.address,
          await ethers.provider.getBalance(p.address)
        );
      }
      await vrfCoordinatorV2PlusMock.fulfillRandomWords(
        requestId,
        await freeTimerContract.getAddress()
      );

      /** @dev After fulfillment, upkeep is needed to process the winners.
      We must provide the correct performData to check for batch processing. */
      const processBatchData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["string", "uint256"],
        ["PROCESS_BATCH", 0]
      );
      const { upkeepNeeded, performData } = await freeTimerContract.checkUpkeep(
        processBatchData
      );
      expect(upkeepNeeded, "Upkeep should be needed to process winners").to.be
        .true;
      await freeTimerContract.performUpkeep(performData);

      /** @dev Verify winners by checking winnerWins mapping */
      let winnerCount = 0;
      for (const p of participants) {
        const wins = await freeTimerContract.winnerWins(p.address);
        if (wins > 0n) winnerCount++;
      }
      expect(winnerCount).to.equal(2);
      expect(await freeTimerContract.raffleStatus()).to.be.false;

      /** @dev 4.Prizes are distributed correctly. */
      const prizePerWinner = ethers.parseEther("1");
      for (const p of participants) {
        const balanceAfter = await ethers.provider.getBalance(p.address);
        const balanceBefore = balancesBefore.get(p.address);
        const wins = await freeTimerContract.winnerWins(p.address);
        if (wins > 0n) {
          expect(balanceAfter).to.equal(balanceBefore + prizePerWinner);
        } else {
          expect(balanceAfter).to.equal(balanceBefore);
        }
      }
    });
  });

  /**
   * @dev Tests edge cases and owner-only functions (withdraw, reset)
   */
  describe("Edge Cases and Owner Functions", function () {
    /**
     * @dev Raffle ends if time expires but not enough players joined
     */
    it("Should end raffle if time expires with insufficient players", async function () {
      /**
       * @dev Fund the contract to cover prize payout
       */
      await fundContract("1");
      /**
       * @dev Start a raffle: 1 minute, 2 winners, max 10 participants
       */
      await freeTimerContract.startRaffle(ethers.parseEther("1"), 1, 2, 10);
      /**
       * @action Only one player joins
       */
      await freeTimerContract.connect(addr1).getFreeTicket();
      /**
       * @action Simulate passage of time to expire the raffle
       * @note 1 minute + 1 second
       */
      await time.increase(61);
      await network.provider.send("evm_mine", []);
      /**
       * @expect Not enough players: upkeep should not be needed
       */
      const { upkeepNeeded } = await freeTimerContract.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.false;
    });

    /**
     * @dev VRF request is triggered when max participants join
     */
    it("Should trigger VRF when max participants are reached", async function () {
      /**
       * @dev Fund contract for prize
       */
      await fundContract("1");
      /**
       * @dev Start raffle: 10 minutes, 2 winners, 3 max participants
       */
      await freeTimerContract.startRaffle(ethers.parseEther("1"), 10, 2, 3);
      /**
       * @action First two participants join
       */
      await freeTimerContract.connect(addr1).getFreeTicket();
      await freeTimerContract.connect(addr2).getFreeTicket();
      /**
       * @action Third participant joins
       * @expect Should trigger VRF randomness request
       */
      await expect(freeTimerContract.connect(addr3).getFreeTicket()).to.emit(
        freeTimerContract,
        "RandomnessRequested"
      );
    });

    /**
     * @dev Owner can withdraw funds only when no raffle is active
     */
    it("Should allow owner to withdraw funds when no raffle is active", async function () {
      const depositAmount = ethers.parseEther("5");
      await fundContract("5");
      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );

      /** @dev Since withdraw sends all contract balance, we need to account for gas */
      const tx = await freeTimerContract.withdrawFunds();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter).to.equal(
        ownerBalanceBefore + depositAmount - gasUsed
      );
    });

    /**
     * @dev Owner cannot withdraw funds if a raffle is active
     */
    it("Should prevent owner from withdrawing funds when a raffle is active", async function () {
      await fundContract("1");
      await freeTimerContract.startRaffle(ethers.parseEther("1"), 5, 1, 10);
      await expect(freeTimerContract.withdrawFunds()).to.be.revertedWith(
        "Cannot withdraw before raffle has ended."
      );
    });

    /**
     * @dev Owner can hard reset the raffle, emits RaffleEnded
     */
    it("Should allow owner to hard reset the raffle", async function () {
      await fundContract("1");
      await freeTimerContract.startRaffle(ethers.parseEther("1"), 5, 1, 10);
      await freeTimerContract.connect(addr1).getFreeTicket();

      await expect(freeTimerContract.hardReset()).to.emit(
        freeTimerContract,
        "RaffleEnded"
      );
      expect(await freeTimerContract.raffleStatus()).to.be.false;
      expect(await freeTimerContract.hasEntered(addr1.address)).to.be.false;
    });
  });

  /**
   * @dev Tests batch winner selection logic with minimal participants
   */
  describe("Batch Logic Verification (Minimal Scale)", function () {
    /**
     * @dev Handles single winner selection and ensures raffle ends
     * @notice Verifies correct state and winner count for minimal batch
     */
    it("Should correctly handle a single winner selection and end the raffle", async function () {
      /**
       * @dev Set minimal prize and participant count
       */
      const prize = ethers.parseEther("1");
      const participantCount = 2;
      /**
       * @dev Fund contract and start raffle
       */
      await fundContract("1");
      await freeTimerContract.startRaffle(prize, 1, 1, participantCount);
      /**
       * @action First participant joins
       */
      await freeTimerContract.connect(addr1).getFreeTicket();
      /**
       * @action Second participant joins, triggers VRF request
       * @expect Should emit RandomnessRequested event
       */
      const tx = await freeTimerContract.connect(addr2).getFreeTicket();
      const receipt = await tx.wait();
      const requestedEvent = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "RandomnessRequested"
      );
      expect(requestedEvent, "RandomnessRequested event should be emitted").to
        .not.be.undefined;
      const requestId = requestedEvent.args.requestId;
      /**
       * @action Fulfill VRF randomness for the request
       */
      await vrfCoordinatorV2PlusMock.fulfillRandomWords(
        requestId,
        await freeTimerContract.getAddress()
      );
      /**
       * @action After fulfillment, upkeep is needed to process the winner
       * @dev Provide correct performData for batch processing
       * @expect Upkeep should be needed to process the winner
       */
      const processBatchData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["string", "uint256"],
        ["PROCESS_BATCH", 0]
      );
      const { upkeepNeeded, performData } = await freeTimerContract.checkUpkeep(
        processBatchData
      );
      expect(upkeepNeeded, "Upkeep should be needed to process the winner").to
        .be.true;
      await freeTimerContract.performUpkeep(performData);
      /**
       * @expect Only one winner should be selected, raffle should end
       */
      const participants = [addr1, addr2];
      let winnerCount = 0;
      for (const p of participants) {
        const wins = await freeTimerContract.winnerWins(p.address);
        if (wins > 0n) winnerCount++;
      }
      expect(winnerCount).to.equal(1);
      expect(await freeTimerContract.raffleStatus()).to.be.false;
    });
  });
});
