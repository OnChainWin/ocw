// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// \\
// Created by Clodron
// If you want to create a new project, please contact me @
// info@clodron.com
// \\

/**
 * @title FreeTimerOnChainWin
 * @notice A contract for running time-based free raffles where users can claim one free ticket
 * @custom:security ReentrancyGuard to prevent reentrancy attacks
 */
contract FreeTimerOnChainWin is ReentrancyGuard {
    address public owner;
    mapping(address => bool) public hasEntered;
    address[] public players;
    address[] public winnerAddresses;
    mapping(address => uint256) public winnerWins;
    bool public raffleStatus;
    uint256 public prizeAmount;
    uint256 public raffleEndTime;
    uint256 public ticketsSoldThisRound;
    uint256 private raffleStartDuration;

    event NewEntry(address indexed player, uint256 numberOfEntries);

    event RaffleStarted(uint256 prizeAmount, uint256 endTime);
    event RaffleEnded();
    event WinnerSelected(address winner, uint256 prizeAmount);

    /**
     * @notice Struct to keep track of winners and their win counts
     */
    struct Winner {
        address addr;
        uint256 winCount;
    }

    Winner[] public winners;
    
    /**
     * @notice Restricts function access to contract owner only
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Just owner.");
        _;
    }

    /**
     * @notice Initializes the contract with the deployer as owner
     */
    constructor() {
        owner = msg.sender;
        raffleStatus = false;
        ticketsSoldThisRound = 0;
    }

    /**
     * @notice Starts a new raffle with specified prize amount and duration
     * @param _prizeAmount The amount to be awarded to the winner
     * @param _duration Duration of the raffle in minutes
     */
    function startRaffle(
        uint256 _prizeAmount,
        uint256 _duration
    ) public onlyOwner {
        require(!raffleStatus, "Raffle already started.");
        require(_prizeAmount > 0, "Prize amount must be greater than 0!");
        require(_prizeAmount <= address(this).balance, "Not enough balance!");

        prizeAmount = _prizeAmount;
        raffleStatus = true;
        raffleEndTime = block.timestamp + (_duration * 1 minutes);
        raffleStartDuration = _duration;
        emit RaffleStarted(_prizeAmount, raffleEndTime);
    }

    /**
     * @notice Allows a user to claim their free ticket for the raffle
     * @dev Users can only claim one free ticket per raffle
     */
    function getFreeTicket() public {
        require(raffleStatus, "Raffle is not started.");
        require(
            !hasEntered[msg.sender],
            "You have already claimed your free ticket."
        );

        players.push(msg.sender);
        hasEntered[msg.sender] = true;
        ticketsSoldThisRound += 1;
        emit NewEntry(msg.sender, ticketsSoldThisRound);

        if (getRemainingTimeSec() == 0) {
            raffleStatus = false;

            selectWinners();
        }
    }

    /**
     * @notice Allows the owner to manually end the raffle if time has expired
     * @dev Uses nonReentrant modifier to prevent reentrancy attacks during prize distribution
     */
    function tryEndRaffle() public onlyOwner nonReentrant {
        require(raffleStatus, "Raffle is not started yet.");
        require(
            block.timestamp > raffleEndTime,
            "Raffle period has not ended yet!"
        );
        require(players.length > 0, "No players in raffle.");

        selectWinner();
    }

    /**
     * @notice Private function to select a winner and distribute prize
     * @dev Called by tryEndRaffle, only accessible to owner
     */
    function selectWinner() private onlyOwner {
        uint256 winnerIndex = random() % players.length;
        address winner = players[winnerIndex];

        winnerAddresses.push(winner);
        winnerWins[winner] += 1;

        payable(winner).transfer(prizeAmount);

        emit WinnerSelected(winner, prizeAmount);
        endRaffle();
    }

    /**
     * @notice Private function to select winners automatically
     * @dev Called when time expires during ticket claim or by hardReset
     */
    function selectWinners() private {
        uint256 winnerIndex = random() % players.length;
        address winner = players[winnerIndex];

        winnerAddresses.push(winner);
        winnerWins[winner] += 1;

        payable(winner).transfer(prizeAmount);

        emit WinnerSelected(winner, prizeAmount);
        endRaffle();
    }

    /**
     * @notice Emergency function to reset the raffle
     * @dev Only callable by the owner
     */
    function hardReset() public onlyOwner {
        endRaffle();
    }

    /**
     * @notice Private function to clean up and reset raffle state
     */
    function endRaffle() private {
        raffleStatus = false;
        for (uint256 i = 0; i < players.length; i++) {
            hasEntered[players[i]] = false;
        }
        delete players;
        prizeAmount = 0;
        ticketsSoldThisRound = 0;
        emit RaffleEnded();
    }

    /**
     * @notice Generates a pseudorandom number for winner selection
     * @dev Uses block properties and player count for randomness
     * @return A pseudorandom uint256 value
     */
    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        players.length
                    )
                )
            );
    }

    /**
     * @notice Allows the owner to deposit funds into the contract
     * @dev Value must be greater than 0
     */
    function initialDeposit() public payable onlyOwner {
        require(msg.value > 0, "Deposit must be greater than 0");
    }

    /**
     * @notice Allows the owner to withdraw all funds from the contract
     * @dev Can only be called when no raffle is active
     */
    function withdrawFunds() public payable onlyOwner nonReentrant {
        require(!raffleStatus, "Cannot withdraw before raffle has ended.");
        require(address(this).balance > 0, "No funds to withdraw");
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @notice Returns the total amount of ETH in the contract
     * @return Current balance in wei
     */
    function getPrizePool() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Gets winner information by index
     * @param index The index of the winner in the winners array
     * @return Address of the winner and their win count
     */
    function getWinnerByIndex(
        uint256 index
    ) public view returns (address, uint256) {
        require(index < winnerAddresses.length, "None");
        address winnerAddress = winnerAddresses[index];
        return (winnerAddress, winnerWins[winnerAddress]);
    }

    /**
     * @notice Returns the total number of winners across all raffles
     * @return Count of winners
     */
    function getTotalWinners() public view returns (uint256) {
        return winnerAddresses.length;
    }

    /**
     * @notice Returns the remaining time in seconds until the raffle ends
     * @return Seconds remaining, or 0 if raffle has ended
     */
    function getRemainingTimeSec() public view returns (uint256) {
        if (block.timestamp >= raffleEndTime || !raffleStatus) {
            return 0;
        } else {
            return raffleEndTime - block.timestamp;
        }
    }

    /**
     * @notice Returns the remaining time in minutes until the raffle ends
     * @return Minutes remaining, or 0 if raffle has ended
     */
    function getRemainingTimeMin() public view returns (uint256) {
        if (block.timestamp >= raffleEndTime || !raffleStatus) {
            return 0;
        } else {
            uint256 remainingTimeInSeconds = raffleEndTime - block.timestamp;
            return remainingTimeInSeconds / 1 minutes;
        }
    }

    /**
     * @notice Returns the remaining time in hours until the raffle ends
     * @return Hours remaining, or 0 if raffle has ended
     */
    function getRemainingTimeHour() public view returns (uint256) {
        if (block.timestamp >= raffleEndTime || !raffleStatus) {
            return 0;
        } else {
            uint256 remainingTimeInSeconds = raffleEndTime - block.timestamp;
            return remainingTimeInSeconds / 1 hours;
        }
    }

    /**
     * @notice Returns the initial duration set for the current raffle
     * @return Duration in minutes
     */
    function getRaffleStartDuration() public view returns (uint256) {
        return raffleStartDuration;
    }

    /**
     * @notice Returns the current contract balance
     * @return Contract balance in wei
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
