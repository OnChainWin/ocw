// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// \\
// Created by Clodron
// If you want to create a new project, please contact me @
// info@clodron.com
// \\

/**
 * @title NYOnChainWin
 * @notice A contract for running paid entry raffles with a configurable prize pool
 * @custom:security ReentrancyGuard to prevent reentrancy attacks
 */
contract NYOnChainWin is ReentrancyGuard {
    address public owner;
    mapping(address => uint256) public entryCount;
    address[] public winners;
    address[] public players;
    address[] private playerSelector;
    bool public raffleStatus;
    uint256 public entryFee;
    uint256 public totalEntries;
    uint256 public prizePool;
    uint256 public targetPrizeAmount;
    uint256 public raffleStartTime;
    uint256 public raffleDuration;

    event NewEntry(address indexed player, uint256 numberOfEntries);
    event RaffleStarted(uint256 prizePool, uint256 startTime, uint256 duration);
    event RaffleEnded(address winner, uint256 prizeAmount);
    event BalanceWithdrawn(uint256 amount);

    /**
     * @notice Initializes the contract with the deployer as owner
     */
    constructor() {
        owner = msg.sender;
        raffleStatus = false;
    }

    /**
     * @notice Restricts function access to contract owner only
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Just owner!");
        _;
    }

    /**
     * @notice Configures and starts a new raffle with specified parameters
     * @param _targetPrizeAmount The target amount for the prize pool
     * @param _durationInMinutes Duration of the raffle in minutes
     * @param _entryFee Cost per ticket in wei
     */
    function setupRaffle(
        uint256 _targetPrizeAmount,
        uint256 _durationInMinutes,
        uint256 _entryFee
    ) public onlyOwner {
        require(!raffleStatus, "Raffle already in progress.");
        require(
            totalEntries == 0,
            "Cannot start a new raffle until the previous one has ended."
        );
        require(_targetPrizeAmount >= _entryFee, "Invalid entry fee.");
        require(_durationInMinutes > 0, "Invalid duration.");
        require(_entryFee > 0, "Invalid entry fee.");
        require(_targetPrizeAmount > 0, "More than 0");

        targetPrizeAmount = _targetPrizeAmount;
        raffleDuration = _durationInMinutes * 1 minutes;
        entryFee = _entryFee;
        raffleStatus = true;
        raffleStartTime = block.timestamp;
        emit RaffleStarted(prizePool, raffleStartTime, raffleDuration);
    }

    /**
     * @notice Allows users to purchase raffle entries
     * @dev Includes a 5% commission fee on top of the entry fee
     * @param _numberOfEntries Number of entries to purchase
     */
    function buyEntry(uint256 _numberOfEntries) public payable {
        require(raffleStatus, "Raffle has not started or finished yet.");
        require(
            prizePool < targetPrizeAmount,
            "Target prize amount has been reached."
        );

        uint256 totalCostWithCommission = (entryFee * _numberOfEntries * 105) /
            100;
        require(
            msg.value >= totalCostWithCommission,
            "You need to pay much more."
        );

        uint256 commission = (totalCostWithCommission -
            (entryFee * _numberOfEntries));
        prizePool += msg.value - commission;

        if (prizePool > targetPrizeAmount) {
            prizePool = targetPrizeAmount;
        }

        for (uint256 i = 0; i < _numberOfEntries; i++) {
            playerSelector.push(msg.sender);
        }
        entryCount[msg.sender] += _numberOfEntries;
        totalEntries += _numberOfEntries;
        emit NewEntry(msg.sender, _numberOfEntries);

        if (prizePool >= targetPrizeAmount || getRemainingTimeSec() == 0) {
            raffleStatus = false;
            selectWinners();
        }
    }

    /**
     * @notice Private function to select winners and distribute prizes
     * @dev Called automatically when conditions are met (time expired or prize pool reached)
     */
    function selectWinners() private {
        require(
            block.timestamp >= raffleStartTime + raffleDuration ||
                prizePool >= targetPrizeAmount,
            "Raffle is not yet ready to end."
        );
        require(playerSelector.length > 0, "No entries in the raffle.");
        require(
            !raffleStatus,
            "Raffle must be ended before selecting a winner."
        );

        uint256 winnerIndex = random() % playerSelector.length;
        address winner = playerSelector[winnerIndex];

        payable(winner).transfer(prizePool);
        emit RaffleEnded(winner, prizePool);

        winners.push(winner);

        resetRaffle();
    }

    /**
     * @notice Allows the owner to manually select a winner when raffle conditions are met
     */
    function selectWinner() public onlyOwner {
        if (
            raffleStatus &&
            (block.timestamp >= raffleStartTime + raffleDuration ||
                prizePool >= targetPrizeAmount)
        ) {
            raffleStatus = false;
        }

        require(
            block.timestamp >= raffleStartTime + raffleDuration ||
                prizePool >= targetPrizeAmount,
            "Raffle is not yet ready to end."
        );
        require(playerSelector.length > 0, "No entries in the raffle.");
        require(
            !raffleStatus,
            "Raffle must be ended before selecting a winner."
        );

        uint256 winnerIndex = random() % playerSelector.length;
        address winner = playerSelector[winnerIndex];

        payable(winner).transfer(prizePool);
        emit RaffleEnded(winner, prizePool);

        winners.push(winner);

        resetRaffle();
    }

    /**
     * @notice Returns the array of all participants in the current raffle
     * @return Array of player addresses with multiple entries for multiple tickets
     */
    function getPlayers() public view returns (address[] memory) {
        return playerSelector;
    }

    /**
     * @notice Returns the number of tickets purchased by a specific player
     * @param player Address of the player to check
     * @return Number of tickets owned by the player
     */
    function getNumberOfTicketsPerPlayer(
        address player
    ) public view returns (uint256) {
        return entryCount[player];
    }

    /**
     * @notice Emergency function to reset the raffle state
     * @dev Only callable by the owner
     */
    function hardReset() public onlyOwner {
        resetRaffle();
    }

    /**
     * @notice Private function to clean up and reset raffle state
     */
    function resetRaffle() private {
        for (uint256 i = 0; i < playerSelector.length; i++) {
            entryCount[playerSelector[i]] = 0;
        }

        delete playerSelector;
        raffleStatus = false;
        totalEntries = 0;
        entryFee = 0;
        prizePool = 0;
        targetPrizeAmount = 0;
        raffleDuration = 0;
        raffleStartTime = 0;
    }

    /**
     * @notice Allows the owner to withdraw the contract balance
     * @dev Can only be called when no raffle is active
     */
    function withdrawBalance() public onlyOwner {
        require(!raffleStatus, "Cannot withdraw before raffle has ended.");
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw.");
        payable(owner).transfer(balance);
        emit BalanceWithdrawn(balance);
    }

    /**
     * @notice Generates a pseudorandom number for winner selection
     * @dev Uses block properties, players length, and contract address for randomness
     * @return A pseudorandom uint256 value
     */
    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        players.length,
                        address(this)
                    )
                )
            );
    }

    /**
     * @notice Returns the current prize pool amount
     * @return Current prize pool in wei
     */
    function getPrizePool() public view returns (uint256) {
        return prizePool;
    }

    /**
     * @notice Returns the total number of entries in the current raffle
     * @return Total entry count
     */
    function getTotalEntries() public view returns (uint256) {
        return totalEntries;
    }

    /**
     * @notice Allows the owner to deposit funds into the contract
     */
    function deposit() external payable onlyOwner {}

    /**
     * @notice Returns the remaining time in seconds until the raffle ends
     * @return Seconds remaining, or 0 if raffle has ended
     */
    function getRemainingTimeSec() public view returns (uint256) {
        if (!raffleStatus) {
            return 0;
        } else {
            uint256 endTime = raffleStartTime + raffleDuration;
            if (block.timestamp >= endTime) {
                return 0;
            } else {
                return endTime - block.timestamp;
            }
        }
    }

    /**
     * @notice Returns the remaining time in minutes until the raffle ends
     * @return Minutes remaining, or 0 if raffle has ended
     */
    function getRemainingTimeMinutes() public view returns (uint256) {
        if (!raffleStatus) {
            return 0;
        } else {
            uint256 endTime = raffleStartTime + raffleDuration;
            if (block.timestamp >= endTime) {
                return 0;
            } else {
                return (endTime - block.timestamp) / 60;
            }
        }
    }

    /**
     * @notice Returns the remaining time in hours until the raffle ends
     * @return Hours remaining, or 0 if raffle has ended
     */
    function getRemainingTimeHours() public view returns (uint256) {
        if (!raffleStatus) {
            return 0;
        } else {
            uint256 endTime = raffleStartTime + raffleDuration;
            if (block.timestamp >= endTime) {
                return 0;
            } else {
                return (endTime - block.timestamp) / 3600;
            }
        }
    }

    /**
     * @notice Returns the total number of winners across all raffles
     * @return Count of winners
     */
    function getWinnerCount() public view returns (uint256) {
        return winners.length;
    }

    /**
     * @notice Gets winner address by index
     * @param index The index of the winner in the winners array
     * @return Address of the winner
     */
    function getWinnerByIndex(uint256 index) public view returns (address) {
        require(index < winners.length, "Index out of bounds");
        return winners[index];
    }

    /**
     * @notice Returns the current contract balance
     * @return Contract balance in wei
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
