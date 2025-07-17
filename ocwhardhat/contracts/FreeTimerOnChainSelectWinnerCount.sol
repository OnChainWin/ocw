// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/dev/vrf/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/dev/vrf/libraries/VRFV2PlusClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// \\
// Created by Clodron
// If you want to create a new project, please contact me @
// info@clodron.com
// \\

/**
 * @title FreeTimerOnChainSelectWinnerCount
 * @dev A decentralized raffle contract that allows multiple winners selection using Chainlink VRF 2.5 for secure randomness
 * @dev This contract is optimized for large winner counts by using batch processing.
 * @notice This contract manages free raffles with configurable winner counts, time limits, and participant caps
 * @author Clodron
 */
contract FreeTimerOnChainSelectWinnerCount is
    ReentrancyGuard,
    VRFConsumerBaseV2Plus,
    AutomationCompatibleInterface
{
    address public raffleOwner;
    bool public raffleStatus;
    bool public timeExpiredButWaiting;
    bool private randomnessRequested;
    uint32 public numberOfWinnersToSelect;
    uint32 public maxParticipants;

    uint256 public prizeAmount;
    uint256 public raffleEndTime;

    uint128 private raffleStartDuration;
    uint128 public ticketsSoldThisRound;

    uint256 private immutable s_subscriptionId;
    bytes32 private immutable s_keyHash;
    uint32 private constant CALLBACK_GAS_LIMIT = 2500000;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    uint256 private s_requestId;
    uint256[] private s_randomWords;
    mapping(address => bool) public hasEntered;
    address[] public players;
    address[] public winnerAddresses;
    mapping(address => uint256) public winnerWins;

    uint256 private constant MAX_WINNERS_PER_BATCH = 25;
    bool private batchSelectionInProgress;
    uint256 private currentBatchIndex;
    address[] private selectedWinnersBatch;
    uint256[] private winnerAmountsBatch;

    uint256 private constant AUTOMATION_BATCH_INTERVAL = 30;
    mapping(uint256 => uint256) private batchProcessedAt;

    event NewEntry(address indexed player, uint256 totalTicketsSoldThisRound);
    event RaffleStarted(
        uint256 prizeAmount,
        uint256 endTime,
        uint32 numberOfWinners,
        uint32 maxParticipants
    );
    event RaffleEnded();
    event WinnerSelected(address winner, uint256 prizeAmountReceived);
    event MaxParticipantsReached(uint256 totalParticipants);
    event AutomationTriggered(string reason);
    event RandomnessRequested(uint256 requestId);
    event RandomnessFulfilled(uint256 requestId);
    event BatchSelectionStarted(uint256 totalWinners, uint256 maxPerBatch);
    event BatchSelectionCompleted(uint256 batchIndex, uint256 winnersInBatch);
    event AllBatchesCompleted(uint256 totalBatches, uint256 totalWinners);
    event AutomationIntervalUpdate(string eventType, uint256 nextExpectedTime);

    modifier onlyRaffleOwner() {
        require(msg.sender == raffleOwner, "Just owner.");
        _;
    }

    /**
     * @dev Constructor initializes the contract with Chainlink VRF 2.5 configuration
     * @param subscriptionId The Chainlink VRF subscription ID for randomness requests
     * @notice Sets up VRF coordinator for Base mainnet and initializes contract owner
     */
    constructor(
        uint256 subscriptionId
    ) VRFConsumerBaseV2Plus(0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634) {
        raffleOwner = msg.sender;

        s_subscriptionId = subscriptionId;
        s_keyHash = 0x00b81b5a830cb0a4009fbd8904de511e28631e62ce5ad231373d3cdad373ccab;
    }

    /**
     * @dev Starts a new raffle with configurable parameters
     * @param _prizeAmount Total prize amount to be distributed among winners (must be divisible by number of winners)
     * @param _duration Duration of the raffle in minutes
     * @param _numberOfWinners Number of winners to select (must be at least 1)
     * @param _maxParticipants Maximum number of participants allowed (must be greater than number of winners)
     * @notice Only the raffle owner can start a raffle. Contract must have sufficient balance for the prize amount.
     * The raffle will automatically end when either time expires OR maximum participants is reached.
     */
    function startRaffle(
        uint256 _prizeAmount,
        uint128 _duration,
        uint32 _numberOfWinners,
        uint32 _maxParticipants
    ) external onlyRaffleOwner {
        require(!raffleStatus, "Raffle already started.");
        require(_prizeAmount > 0, "Prize amount must be greater than 0!");
        require(_numberOfWinners > 0, "Number of winners must be at least 1.");
        require(
            _maxParticipants > _numberOfWinners,
            "Max participants must be greater than number of winners."
        );
        require(
            _prizeAmount % _numberOfWinners == 0,
            "Prize amount must be divisible by the number of winners."
        );
        require(
            _prizeAmount <= address(this).balance,
            "Not enough contract balance for the prize amount!"
        );

        prizeAmount = _prizeAmount;
        numberOfWinnersToSelect = _numberOfWinners;
        maxParticipants = _maxParticipants;
        raffleStatus = true;
        timeExpiredButWaiting = false;
        randomnessRequested = false;
        delete s_randomWords;
        s_requestId = 0;
        raffleEndTime = block.timestamp + (_duration * 1 minutes);
        raffleStartDuration = _duration;

        emit RaffleStarted(
            prizeAmount,
            raffleEndTime,
            numberOfWinnersToSelect,
            maxParticipants
        );
    }

    /**
     * @dev Allows users to claim their free ticket for the current raffle
     * @notice Each address can only claim one free ticket per raffle. Raffle must be active and not at maximum capacity.
     * If maximum participants is reached, the raffle will automatically trigger winner selection.
     * Minimum participants required is numberOfWinners + 1 for fair selection.
     */
    function getFreeTicket() external nonReentrant {
        require(raffleStatus, "Raffle is not started.");
        require(
            !batchSelectionInProgress,
            "Batch selection in progress. No more entries allowed."
        );
        require(
            !hasEntered[msg.sender],
            "You have already claimed your free ticket."
        );
        require(
            numberOfWinnersToSelect > 0,
            "Raffle not properly configured (number of winners)."
        );
        require(
            players.length < maxParticipants,
            "Maximum number of participants reached."
        );

        players.push(msg.sender);
        hasEntered[msg.sender] = true;
        ticketsSoldThisRound++;

        emit NewEntry(msg.sender, ticketsSoldThisRound);

        bool shouldTriggerVRF = false;
        string memory triggerReason = "";

        if (players.length >= maxParticipants) {
            emit MaxParticipantsReached(players.length);
            if (players.length >= numberOfWinnersToSelect + 1) {
                shouldTriggerVRF = true;
                triggerReason = "Maximum participants reached";
            } else {
                endRaffle();
                return;
            }
        } else if (
            block.timestamp >= raffleEndTime &&
            players.length >= numberOfWinnersToSelect + 1
        ) {
            shouldTriggerVRF = true;
            triggerReason = "Time expired and minimum threshold reached";
        }

        if (shouldTriggerVRF && !randomnessRequested) {
            _requestRandomWords();
            emit AutomationTriggered(triggerReason);
        }
    }

    /**
     * @dev Chainlink Automation function to check if upkeep is needed
     * @return upkeepNeeded True if the raffle should be ended due to time expiry OR batch processing is needed
     * @return performData Encoded data indicating the reason for upkeep
     * @notice Upkeep is needed when:
     * 1. Raffle is active, time has expired, enough players have joined, and randomness hasn't been requested yet
     * 2. Batch selection is in progress and needs to process next batch
     */
    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        bool randomnessReceived = s_randomWords.length > 0;
        bool batchProcessingNeeded = randomnessReceived &&
            winnerAddresses.length < numberOfWinnersToSelect;

        if (raffleStatus && batchProcessingNeeded) {
            upkeepNeeded = true;
            performData = abi.encode("PROCESS_BATCH", 0);
            return (upkeepNeeded, performData);
        }

        bool sufficientPlayersForVRF = players.length >=
            numberOfWinnersToSelect + 1;
        bool timeExpired = block.timestamp >= raffleEndTime;
        bool raffleActive = raffleStatus;
        bool randomnessNotRequested = !randomnessRequested;

        if (
            raffleActive &&
            timeExpired &&
            sufficientPlayersForVRF &&
            randomnessNotRequested
        ) {
            upkeepNeeded = true;
            performData = abi.encode("REQUEST_VRF", 0);
            return (upkeepNeeded, performData);
        }

        return (false, "");
    }

    /**
     * @dev Chainlink Automation function that performs upkeep
     * @param performData Data indicating what action to perform
     * @notice Automatically handles VRF requests and batch processing without manual intervention
     */
    function performUpkeep(bytes calldata performData) external override {
        (string memory action, ) = abi.decode(performData, (string, uint256));

        if (
            keccak256(abi.encodePacked(action)) ==
            keccak256(abi.encodePacked("PROCESS_BATCH"))
        ) {
            require(raffleStatus, "Raffle is not active");
            require(s_randomWords.length > 0, "No randomness available");
            require(
                winnerAddresses.length < numberOfWinnersToSelect,
                "All winners already processed"
            );

            _processNextBatch();
            emit AutomationTriggered("Automatic batch processing");
        } else if (
            keccak256(abi.encodePacked(action)) ==
            keccak256(abi.encodePacked("REQUEST_VRF"))
        ) {
            require(raffleStatus, "Raffle is not active");
            require(
                players.length >= numberOfWinnersToSelect + 1,
                "Not enough players"
            );
            require(!randomnessRequested, "VRF already requested");

            _requestRandomWords();
            emit AutomationTriggered("Automatic VRF request on time expiry");
        }
    }

    /**
     * @dev VRF callback - only stores randomness, automation handles the rest
     * @param requestId The request ID that matches the original request
     * @param randomWords Array of random words from Chainlink VRF
     * @notice Lightweight callback to prevent gas issues
     */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        require(s_requestId == requestId, "Invalid request ID");
        s_randomWords = randomWords;
        emit RandomnessFulfilled(requestId);
    }

    /**
     * @dev Lightweight batch initiation for small winner counts
     * @notice Prepares batch selection without doing the actual winner selection in VRF callback
     */
    function _initiateSmallBatchSelection() private {
        require(
            !batchSelectionInProgress,
            "Batch selection already in progress"
        );

        batchSelectionInProgress = true;
        currentBatchIndex = 0;

        delete selectedWinnersBatch;
        delete winnerAmountsBatch;

        batchProcessedAt[0] = block.timestamp - AUTOMATION_BATCH_INTERVAL;

        emit BatchSelectionStarted(
            numberOfWinnersToSelect,
            MAX_WINNERS_PER_BATCH
        );
        emit AutomationIntervalUpdate(
            "BATCH_PROCESSING_READY",
            block.timestamp
        );
    }

    /**
     * @dev Enhanced batch selection initiation with automation timing
     * @notice Prepares the contract for automated multi-transaction winner selection
     */
    function _initiateBatchSelection() private {
        require(
            !batchSelectionInProgress,
            "Batch selection already in progress"
        );

        batchSelectionInProgress = true;
        currentBatchIndex = 0;

        delete selectedWinnersBatch;
        delete winnerAmountsBatch;

        batchProcessedAt[0] = block.timestamp - AUTOMATION_BATCH_INTERVAL;

        emit BatchSelectionStarted(
            numberOfWinnersToSelect,
            MAX_WINNERS_PER_BATCH
        );
        emit AutomationIntervalUpdate(
            "BATCH_PROCESSING_READY",
            block.timestamp
        );
    }

    /**
     * @dev Enhanced internal batch processing with timing controls
     * @notice Processes batches with automation-friendly timing intervals
     */
    function _processNextBatchInternal() private {
        if (selectedWinnersBatch.length == 0) {
            _selectWinnersForBatch();
        }

        uint256 startIndex = currentBatchIndex * MAX_WINNERS_PER_BATCH;
        uint256 endIndex = startIndex + MAX_WINNERS_PER_BATCH;
        if (endIndex > selectedWinnersBatch.length) {
            endIndex = selectedWinnersBatch.length;
        }

        uint256 batchSize = endIndex - startIndex;

        for (uint256 i = startIndex; i < endIndex; i++) {
            winnerAddresses.push(selectedWinnersBatch[i]);
            winnerWins[selectedWinnersBatch[i]] += 1;

            if (winnerAmountsBatch[i] > 0) {
                (bool success, ) = payable(selectedWinnersBatch[i]).call{
                    value: winnerAmountsBatch[i]
                }("");
                require(success, "Transfer failed");
            }
            emit WinnerSelected(selectedWinnersBatch[i], winnerAmountsBatch[i]);
        }

        currentBatchIndex++;
        batchProcessedAt[currentBatchIndex] = block.timestamp;
        emit BatchSelectionCompleted(currentBatchIndex - 1, batchSize);

        if (
            currentBatchIndex * MAX_WINNERS_PER_BATCH >=
            selectedWinnersBatch.length
        ) {
            _completeBatchSelection();
            emit AutomationIntervalUpdate(
                "ALL_BATCHES_COMPLETED",
                block.timestamp
            );
        } else {
            emit AutomationIntervalUpdate(
                "NEXT_BATCH_READY",
                block.timestamp + AUTOMATION_BATCH_INTERVAL
            );
        }
    }

    /**
     * @dev Internal function to request random words from Chainlink VRF
     * @notice Uses VRF 2.5 with secure parameters: 3 confirmations, 1M gas limit, 1 random word
     * Can only be called once per raffle to prevent manipulation
     */
    function _requestRandomWords() internal {
        require(!randomnessRequested, "Randomness already requested");
        require(raffleStatus, "Raffle must be active");
        require(
            players.length >= numberOfWinnersToSelect + 1,
            "Not enough players"
        );

        randomnessRequested = true;

        s_requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        emit RandomnessRequested(s_requestId);
    }

    /**
     * @dev Processes next batch of winners (25 at a time)
     * @notice Selects and pays winners in batches to avoid gas limits
     */
    function _processNextBatch() private {
        require(s_randomWords.length > 0, "No randomness available");
        require(raffleStatus, "Raffle must be active");
        require(
            winnerAddresses.length < numberOfWinnersToSelect,
            "All winners already processed"
        );

        uint256 numPlayers = players.length;
        require(
            numPlayers >= numberOfWinnersToSelect + 1,
            "Not enough players"
        );

        uint256 prizePerWinner = prizeAmount / numberOfWinnersToSelect;
        uint256 randomSeed = s_randomWords[0];

        uint256 currentWinnersCount = winnerAddresses.length;
        uint256 remainingWinners = numberOfWinnersToSelect -
            currentWinnersCount;
        uint256 batchSize = remainingWinners > MAX_WINNERS_PER_BATCH
            ? MAX_WINNERS_PER_BATCH
            : remainingWinners;

        for (uint256 i = 0; i < batchSize; i++) {
            uint256 currentIndex = currentWinnersCount + i;
            uint256 uniqueRandom = uint256(
                keccak256(
                    abi.encodePacked(randomSeed, currentIndex, block.timestamp)
                )
            );
            uint256 randomIndexInRemaining = currentIndex +
                (uniqueRandom % (numPlayers - currentIndex));

            address temp = players[currentIndex];
            players[currentIndex] = players[randomIndexInRemaining];
            players[randomIndexInRemaining] = temp;

            address winner = players[currentIndex];
            winnerAddresses.push(winner);
            winnerWins[winner] += 1;

            if (prizePerWinner > 0) {
                (bool success, ) = payable(winner).call{value: prizePerWinner}(
                    ""
                );
                require(success, "Transfer failed");
            }
            emit WinnerSelected(winner, prizePerWinner);
        }

        if (winnerAddresses.length >= numberOfWinnersToSelect) {
            endRaffle();
        }
    }

    /**
     * @dev Simple function to process winners when automation fails
     * @notice Owner can call this manually to complete the raffle
     */
    function completeRaffle() external onlyRaffleOwner {
        require(raffleStatus, "Raffle is not active");
        require(s_randomWords.length > 0, "No randomness available");

        if (winnerAddresses.length == 0) {
            uint256 numPlayers = players.length;
            require(
                numPlayers >= numberOfWinnersToSelect + 1,
                "Not enough players"
            );

            uint256 prizePerWinner = prizeAmount / numberOfWinnersToSelect;
            uint256 randomSeed = s_randomWords[0];

            for (uint256 i = 0; i < numberOfWinnersToSelect; i++) {
                uint256 uniqueRandom = uint256(
                    keccak256(abi.encodePacked(randomSeed, i, block.timestamp))
                );
                uint256 randomIndexInRemaining = i +
                    (uniqueRandom % (numPlayers - i));

                address temp = players[i];
                players[i] = players[randomIndexInRemaining];
                players[randomIndexInRemaining] = temp;
            }

            for (uint256 i = 0; i < numberOfWinnersToSelect; i++) {
                address winner = players[i];
                winnerAddresses.push(winner);
                winnerWins[winner] += 1;

                if (prizePerWinner > 0) {
                    (bool success, ) = payable(winner).call{
                        value: prizePerWinner
                    }("");
                    require(success, "Transfer failed");
                }
                emit WinnerSelected(winner, prizePerWinner);
            }

            endRaffle();
        }
    }

    /**
     * @dev Selects all winners using Fisher-Yates shuffle and prepares them for batch processing
     * @notice This runs separately from VRF callback to prevent gas issues
     */
    function _selectWinnersForBatch() private {
        require(s_randomWords.length > 0, "Random words not available");
        require(raffleStatus, "Raffle must be active");

        uint256 numPlayers = players.length;
        uint256 randomSeed = s_randomWords[0];

        for (uint256 i = 0; i < numberOfWinnersToSelect; i++) {
            uint256 uniqueRandom = uint256(
                keccak256(abi.encodePacked(randomSeed, i, block.timestamp))
            );
            uint256 randomIndexInRemaining = i +
                (uniqueRandom % (numPlayers - i));

            address temp = players[i];
            players[i] = players[randomIndexInRemaining];
            players[randomIndexInRemaining] = temp;

            selectedWinnersBatch.push(players[i]);
            winnerAmountsBatch.push(prizeAmount / numberOfWinnersToSelect);
        }
    }

    /**
     * @dev Processes the next batch of winners (MANUAL BACKUP - Automation handles this automatically)
     * @notice Owner can call this to process winners in batches when automation fails
     * This approach ensures all winners get their prizes even with large winner counts
     * NOTE: Chainlink Automation should handle this automatically, use only if automation fails
     */
    function processNextWinnerBatch() external onlyRaffleOwner {
        require(batchSelectionInProgress, "No batch selection in progress");

        bool needsWinnerSelection = selectedWinnersBatch.length == 0;
        bool needsBatchProcessing = currentBatchIndex * MAX_WINNERS_PER_BATCH <
            selectedWinnersBatch.length;

        require(
            needsWinnerSelection || needsBatchProcessing,
            "All batches completed"
        );

        _processNextBatchInternal();
        emit AutomationTriggered("Manual batch processing (automation backup)");
    }

    /**
     * @dev Completes the batch selection process and cleans up
     * @notice Finalizes the raffle after all winner batches have been processed
     */
    function _completeBatchSelection() private {
        uint256 totalBatches = currentBatchIndex;
        uint256 totalWinners = selectedWinnersBatch.length;

        delete selectedWinnersBatch;
        delete winnerAmountsBatch;
        batchSelectionInProgress = false;
        currentBatchIndex = 0;

        emit AllBatchesCompleted(totalBatches, totalWinners);
        endRaffle();
    }

    /**
     * @dev Returns batch selection status and progress
     * @return inProgress Whether batch selection is currently active
     * @return totalBatches Total number of batches needed
     * @return currentBatch Current batch being processed
     * @return winnersPerBatch Maximum winners processed per batch
     */
    function getBatchSelectionStatus()
        external
        view
        returns (
            bool inProgress,
            uint256 totalBatches,
            uint256 currentBatch,
            uint256 winnersPerBatch
        )
    {
        inProgress = batchSelectionInProgress;
        winnersPerBatch = MAX_WINNERS_PER_BATCH;

        if (inProgress) {
            if (selectedWinnersBatch.length == 0) {
                totalBatches =
                    (numberOfWinnersToSelect + MAX_WINNERS_PER_BATCH - 1) /
                    MAX_WINNERS_PER_BATCH;
            } else {
                totalBatches =
                    (selectedWinnersBatch.length + MAX_WINNERS_PER_BATCH - 1) /
                    MAX_WINNERS_PER_BATCH;
            }
            currentBatch = currentBatchIndex;
        }
    }

    /**
     * @dev Emergency function to immediately end the current raffle
     * @notice Only the raffle owner can call this function.
     * Since this is a FREE raffle system, no refunds are provided to participants.
     * This function is intended for emergency situations or when a raffle needs to be cancelled.
     * All participants lose their free tickets but no financial loss occurs as tickets are free.
     */
    function hardReset() external onlyRaffleOwner {
        endRaffle();
    }

    /**
     * @dev Manual function to trigger VRF request if conditions are met
     * @notice Only the raffle owner can call this function. Useful for triggering VRF manually
     * when automation might have failed or when debugging issues.
     */
    function manualTriggerVRF() external onlyRaffleOwner {
        require(raffleStatus, "Raffle is not active");
        require(
            players.length >= numberOfWinnersToSelect + 1,
            "Not enough players"
        );
        require(!randomnessRequested, "VRF already requested");

        _requestRandomWords();
        emit AutomationTriggered("Manual VRF trigger by owner");
    }

    /**
     * @dev Internal function to clean up raffle state and reset all variables
     * @notice Resets all raffle-related state variables, clears participant lists,
     * and marks all participants as not having entered for future raffles
     */
    function endRaffle() private {
        raffleStatus = false;
        timeExpiredButWaiting = false;
        randomnessRequested = false;
        delete s_randomWords;
        s_requestId = 0;

        for (uint256 i = 0; i < players.length; i++) {
            hasEntered[players[i]] = false;
        }
        delete players;

        delete winnerAddresses;

        prizeAmount = 0;
        ticketsSoldThisRound = 0;
        emit RaffleEnded();
    }

    /**
     * @dev Allows the owner to deposit funds into the contract for future raffles
     * @notice Only the raffle owner can deposit funds. These funds will be used as prize pools for future raffles.
     */
    function initialDeposit() external payable onlyRaffleOwner {
        require(msg.value > 0, "Deposit must be greater than 0");
    }

    /**
     * @dev Allows the owner to withdraw remaining funds from the contract
     * @notice Only the raffle owner can withdraw funds. Cannot withdraw while a raffle is active.
     * This ensures that active raffle prize pools remain secure until the raffle concludes.
     */
    function withdrawFunds() external onlyRaffleOwner nonReentrant {
        require(!raffleStatus, "Cannot withdraw before raffle has ended.");
        require(address(this).balance > 0, "No funds to withdraw");
        (bool success, ) = payable(raffleOwner).call{
            value: address(this).balance
        }("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Retrieves winner information by index in the winners array
     * @param index The index of the winner in the winnerAddresses array
     * @return The winner's address and their total number of wins across all raffles
     * @notice Useful for displaying winner information and tracking historical wins
     */
    function getWinnerByIndex(
        uint256 index
    ) external view returns (address, uint256) {
        require(
            index < winnerAddresses.length,
            "Index out of bounds for winners list."
        );
        address winnerAddress = winnerAddresses[index];
        return (winnerAddress, winnerWins[winnerAddress]);
    }

    /**
     * @dev Returns the total number of winners selected across all raffles
     * @return The length of the winnerAddresses array
     * @notice Provides the count for iterating through all historical winners
     */
    function getTotalWinners() external view returns (uint256) {
        return winnerAddresses.length;
    }

    /**
     * @dev Returns the current raffle's total prize amount
     * @return The prize amount if raffle is active, 0 if no active raffle
     * @notice Useful for displaying current raffle information to users
     */
    function getCurrentRafflePrize() external view returns (uint256) {
        return raffleStatus ? prizeAmount : 0;
    }

    /**
     * @dev Calculates the prize amount each winner will receive in the current raffle
     * @return The prize per winner if raffle is active and properly configured, 0 otherwise
     * @notice Divides total prize equally among all winners
     */
    function getCurrentPrizePerWinner() external view returns (uint256) {
        if (!raffleStatus || numberOfWinnersToSelect == 0) return 0;
        return prizeAmount / numberOfWinnersToSelect;
    }

    /**
     * @dev Returns the remaining time in seconds for the current raffle
     * @return Remaining seconds, 0 if expired/inactive, max uint256 if waiting for more players
     * @notice Provides real-time countdown information for frontend applications
     */
    function getRemainingTimeSec() external view returns (uint256) {
        if (!raffleStatus) {
            return 0;
        } else if (timeExpiredButWaiting) {
            return type(uint256).max;
        } else if (block.timestamp >= raffleEndTime) {
            return 0;
        } else {
            return raffleEndTime - block.timestamp;
        }
    }

    /**
     * @dev Returns the remaining time in minutes for the current raffle
     * @return Remaining minutes, 0 if expired/inactive, max uint256 if waiting for more players
     * @notice Convenient time format for user interfaces showing countdown in minutes
     */
    function getRemainingTimeMin() external view returns (uint256) {
        uint256 remainingSec = this.getRemainingTimeSec();
        if (remainingSec == type(uint256).max) {
            return type(uint256).max;
        } else if (remainingSec == 0) {
            return 0;
        } else {
            return remainingSec / 1 minutes;
        }
    }

    /**
     * @dev Returns the remaining time in hours for the current raffle
     * @return Remaining hours, 0 if expired/inactive, max uint256 if waiting for more players
     * @notice Convenient time format for user interfaces showing countdown in hours
     */
    function getRemainingTimeHour() external view returns (uint256) {
        uint256 remainingSec = this.getRemainingTimeSec();
        if (remainingSec == type(uint256).max) {
            return type(uint256).max;
        } else if (remainingSec == 0) {
            return 0;
        } else {
            return remainingSec / 1 hours;
        }
    }

    /**
     * @dev Returns the duration that was set when the current raffle started
     * @return The raffle duration in minutes as set during raffle initialization
     * @notice Useful for displaying original raffle duration to users
     */
    function getRaffleStartDuration() external view returns (uint128) {
        return raffleStartDuration;
    }

    /**
     * @dev Returns the current balance of the contract
     * @return The contract's ETH balance in wei
     * @notice Shows available funds for future raffle prizes
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Returns the number of winners configured for the current raffle
     * @return The number of winners that will be selected in the active raffle
     * @notice Provides current raffle configuration information
     */
    function getNumberOfWinnersForCurrentRaffle()
        external
        view
        returns (uint32)
    {
        return numberOfWinnersToSelect;
    }

    /**
     * @dev Checks if the current raffle has enough players to proceed with winner selection
     * @return True if player count >= (numberOfWinners + 1), false otherwise
     * @notice Ensures fair raffle by requiring at least one more participant than winners
     */
    function hasEnoughPlayers() external view returns (bool) {
        return players.length >= numberOfWinnersToSelect + 1;
    }

    /**
     * @dev Indicates if the raffle time has expired but is waiting for more players
     * @return True if time expired but insufficient players joined
     * @notice Used to display waiting status when minimum participant threshold isn't met
     */
    function isWaitingForMorePlayers() external view returns (bool) {
        return timeExpiredButWaiting;
    }

    /**
     * @dev Returns the minimum number of players needed for the raffle to proceed
     * @return The minimum player count (numberOfWinners + 1)
     * @notice Ensures fair selection by requiring more participants than winners
     */
    function getMinimumPlayersNeeded() external view returns (uint32) {
        return numberOfWinnersToSelect + 1;
    }

    /**
     * @dev Returns the maximum number of participants allowed in the current raffle
     * @return The maximum participant limit as configured during raffle start
     * @notice Provides raffle capacity information for user interfaces
     */
    function getMaxParticipants() external view returns (uint32) {
        return maxParticipants;
    }

    /**
     * @dev Calculates how many more participants can join the current raffle
     * @return The number of remaining slots, 0 if raffle is full or inactive
     * @notice Useful for showing availability status to potential participants
     */
    function getRemainingSlots() external view returns (uint32) {
        if (!raffleStatus || players.length >= maxParticipants) {
            return 0;
        }
        return maxParticipants - uint32(players.length);
    }

    /**
     * @dev Checks if the maximum participant limit has been reached
     * @return True if current participants >= maximum allowed participants
     * @notice Indicates when raffle will automatically trigger winner selection due to capacity
     */
    function isMaxParticipantsReached() external view returns (bool) {
        return players.length >= maxParticipants;
    }

    /**
     * @dev Returns the current number of participants in the active raffle
     * @return The length of the players array (current participant count)
     * @notice Provides real-time participation statistics
     */
    function getCurrentPlayersCount() external view returns (uint256) {
        return players.length;
    }

    /**
     * @dev Checks if a specific address has already entered the current raffle
     * @param player The address to check for participation status
     * @return True if the address has claimed a free ticket, false otherwise
     * @notice Prevents double entries and provides participation status for UI
     */
    function hasPlayerEntered(address player) external view returns (bool) {
        return hasEntered[player];
    }

    /**
     * @dev Returns the current status of Chainlink VRF randomness request
     * @return isRequested True if randomness has been requested for current raffle
     * @return requestId The VRF request ID for tracking
     * @return hasRandomWords True if random words have been received
     * @return subscriptionId The Chainlink VRF subscription ID used
     * @notice Provides transparency into the randomness generation process for auditing
     */
    function getVRFStatus()
        external
        view
        returns (
            bool isRequested,
            uint256 requestId,
            bool hasRandomWords,
            uint256 subscriptionId
        )
    {
        return (
            randomnessRequested,
            s_requestId,
            s_randomWords.length > 0,
            s_subscriptionId
        );
    }

    /**
     * @dev Debug function to check current raffle state and VRF trigger conditions
     * @return raffleActive Is the raffle currently active
     * @return timeExpired Has the raffle time expired
     * @return currentPlayers Current number of participants
     * @return minPlayersNeeded Minimum players needed (winners + 1)
     * @return sufficientPlayers Whether minimum threshold is met
     * @return vrfRequested Whether VRF has been requested
     * @return canTriggerVRF Whether VRF can be triggered now
     * @notice Useful for debugging why VRF might not be triggering
     */
    function getRaffleDebugInfo()
        external
        view
        returns (
            bool raffleActive,
            bool timeExpired,
            uint256 currentPlayers,
            uint256 minPlayersNeeded,
            bool sufficientPlayers,
            bool vrfRequested,
            bool canTriggerVRF
        )
    {
        raffleActive = raffleStatus;
        timeExpired = block.timestamp >= raffleEndTime;
        currentPlayers = players.length;
        minPlayersNeeded = numberOfWinnersToSelect + 1;
        sufficientPlayers = players.length >= numberOfWinnersToSelect + 1;
        vrfRequested = randomnessRequested;
        canTriggerVRF = raffleActive && sufficientPlayers && !vrfRequested;

        return (
            raffleActive,
            timeExpired,
            currentPlayers,
            minPlayersNeeded,
            sufficientPlayers,
            vrfRequested,
            canTriggerVRF
        );
    }

    /**
     * @dev Internal function to batch process winner storage updates and transfers
     * @param winners Array of selected winner addresses
     * @param amounts Array of prize amounts for each winner
     * @notice Optimizes gas usage by batching operations and reducing storage writes
     */
    function _batchProcessWinners(
        address[] memory winners,
        uint256[] memory amounts
    ) private {
        uint256 winnersCount = winners.length;

        for (uint256 i = 0; i < winnersCount; i++) {
            winnerAddresses.push(winners[i]);
            winnerWins[winners[i]] += 1;
        }

        for (uint256 i = 0; i < winnersCount; i++) {
            if (amounts[i] > 0) {
                (bool success, ) = payable(winners[i]).call{value: amounts[i]}(
                    ""
                );
                require(success, "Transfer failed");
            }
            emit WinnerSelected(winners[i], amounts[i]);
        }
    }

    /**
     * @dev Emergency fallback function to manually process winners when VRF callback fails
     * @param startIndex Starting index for winner processing
     * @param count Number of winners to process in this transaction
     * @notice Owner can use this when VRF callback fails due to gas limits
     * Requires that randomness has been received but selection hasn't completed
     */
    function emergencyProcessWinners(
        uint256 startIndex,
        uint256 count
    ) external onlyRaffleOwner {
        require(s_randomWords.length > 0, "Random words not available yet");
        require(raffleStatus, "Raffle must be active");
        require(
            startIndex + count <= numberOfWinnersToSelect,
            "Index out of bounds"
        );
        require(
            !batchSelectionInProgress,
            "Batch selection already in progress"
        );

        uint256 numPlayers = players.length;
        require(
            numPlayers >= numberOfWinnersToSelect + 1,
            "Insufficient players"
        );

        uint256 prizePerWinner = prizeAmount / numberOfWinnersToSelect;
        uint256 randomSeed = s_randomWords[0];

        if (startIndex == 0) {
            for (uint256 i = 0; i < numberOfWinnersToSelect; i++) {
                uint256 uniqueRandom = uint256(
                    keccak256(abi.encodePacked(randomSeed, i, block.timestamp))
                );
                uint256 randomIndexInRemaining = i +
                    (uniqueRandom % (numPlayers - i));

                address temp = players[i];
                players[i] = players[randomIndexInRemaining];
                players[randomIndexInRemaining] = temp;
            }
        }

        for (uint256 i = startIndex; i < startIndex + count; i++) {
            address winner = players[i];

            winnerAddresses.push(winner);
            winnerWins[winner] += 1;

            if (prizePerWinner > 0) {
                (bool success, ) = payable(winner).call{value: prizePerWinner}(
                    ""
                );
                require(success, "Transfer failed");
            }
            emit WinnerSelected(winner, prizePerWinner);
        }

        if (startIndex + count >= numberOfWinnersToSelect) {
            endRaffle();
        }
    }

    /**
     * @dev Debug function to check batch processing status
     * @return inProgress Whether batch selection is currently active
     * @return currentBatch Current batch index being processed
     * @return totalBatches Total number of batches needed
     * @return winnersRemaining Number of winners still to be processed
     * @return nextBatchReadyAt When the next batch will be ready for processing
     * @notice Useful for debugging automation issues and monitoring progress
     */
    function getBatchProcessingDebugInfo()
        external
        view
        returns (
            bool inProgress,
            uint256 currentBatch,
            uint256 totalBatches,
            uint256 winnersRemaining,
            uint256 nextBatchReadyAt
        )
    {
        inProgress = batchSelectionInProgress;
        currentBatch = currentBatchIndex;

        if (inProgress) {
            if (selectedWinnersBatch.length == 0) {
                totalBatches =
                    (numberOfWinnersToSelect + MAX_WINNERS_PER_BATCH - 1) /
                    MAX_WINNERS_PER_BATCH;
                winnersRemaining = numberOfWinnersToSelect;
            } else {
                totalBatches =
                    (selectedWinnersBatch.length + MAX_WINNERS_PER_BATCH - 1) /
                    MAX_WINNERS_PER_BATCH;
                uint256 processed = currentBatchIndex * MAX_WINNERS_PER_BATCH;
                winnersRemaining = selectedWinnersBatch.length > processed
                    ? selectedWinnersBatch.length - processed
                    : 0;
            }
            nextBatchReadyAt =
                batchProcessedAt[currentBatchIndex] +
                AUTOMATION_BATCH_INTERVAL;
        }
    }
}
