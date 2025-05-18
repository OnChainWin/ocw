// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// \\
// Created by Clodron
// If you want to create a new project, please contact me @
// info@clodron.com
// \\

/**
 * @title OnChainWinB2B
 * @notice A contract for fixed-prize raffles requiring a specific number of entries
 * @custom:security ReentrancyGuard to prevent reentrancy attacks
 */
contract OnChainWinB2B is ReentrancyGuard {
    address public owner;
    mapping(address => uint256) public entryCount;
    address[] public winners;
    address[] private playerSelector;

    bool public raffleStatus;
    uint256 public entryFee;
    uint256 public totalEntries;
    uint256 public fixedPrizeAmount;
    uint256 public requiredEntries;
    uint256 public commissionRate = 5;

    event NewEntry(address indexed player, uint256 numberOfEntries);
    event RaffleStarted(
        uint256 fixedPrizeAmount,
        uint256 requiredEntries,
        uint256 entryFee
    );
    event RaffleEnded(address winner, uint256 prizeAmount);
    event BalanceWithdrawn(uint256 amount);

    /**
     * @notice Restricts function access to contract owner only
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Just owner!");
        _;
    }

    /**
     * @notice Initializes the contract with the deployer as owner
     */
    constructor() {
        owner = msg.sender;
        raffleStatus = false;
    }

    /**
     * @notice Configures and starts a new raffle with specified parameters
     * @param _fixedPrizeAmount The fixed amount for the prize
     * @param _requiredEntries Number of entries required to complete the raffle
     * @param _entryFee Cost per ticket in wei
     */
    function setupRaffle(
        uint256 _fixedPrizeAmount,
        uint256 _requiredEntries,
        uint256 _entryFee
    ) public onlyOwner {
        require(!raffleStatus, "Raffle already in progress.");
        require(
            totalEntries == 0,
            "Cannot start a new raffle until the previous one has ended."
        );
        require(_requiredEntries > 0, "Invalid required entries.");
        require(_entryFee > 0, "Invalid entry fee.");
        require(_fixedPrizeAmount > 0, "Fixed prize must be greater than 0");

        require(
            address(this).balance >= _fixedPrizeAmount,
            "Not enough contract balance for the fixed prize"
        );

        fixedPrizeAmount = _fixedPrizeAmount;
        requiredEntries = _requiredEntries;
        entryFee = _entryFee;
        raffleStatus = true;

        emit RaffleStarted(fixedPrizeAmount, requiredEntries, entryFee);
    }

    /**
     * @notice Allows users to purchase raffle entries
     * @dev Includes commission fee on top of the entry fee
     * @param _numberOfEntries Number of entries to purchase
     */
    function buyEntry(uint256 _numberOfEntries) public payable nonReentrant {
        require(raffleStatus, "Raffle has not started or finished yet.");
        require(
            _numberOfEntries > 0,
            "Number of entries must be greater than zero."
        );

        uint256 totalCostWithCommission = (entryFee *
            _numberOfEntries *
            (100 + commissionRate)) / 100;
        require(msg.value >= totalCostWithCommission, "You need to pay more.");

        for (uint256 i = 0; i < _numberOfEntries; i++) {
            playerSelector.push(msg.sender);
        }

        entryCount[msg.sender] += _numberOfEntries;
        totalEntries += _numberOfEntries;
        emit NewEntry(msg.sender, _numberOfEntries);

        if (totalEntries >= requiredEntries) {
            raffleStatus = false;
            selectWinner();
        }
    }

    /**
     * @notice Private function to select a winner and distribute prize
     * @dev Called automatically when required entries are reached
     */
    function selectWinner() private {
        require(
            !raffleStatus,
            "Raffle must be ended before selecting a winner."
        );
        require(playerSelector.length > 0, "No entries in the raffle.");
        require(
            address(this).balance >= fixedPrizeAmount,
            "Not enough balance to pay the prize."
        );

        uint256 winnerIndex = random() % playerSelector.length;
        address winner = playerSelector[winnerIndex];

        payable(winner).transfer(fixedPrizeAmount);
        emit RaffleEnded(winner, fixedPrizeAmount);

        winners.push(winner);

        resetsContracts();
    }

    /**
     * @notice Emergency function to reset the raffle state
     * @dev Only callable by the owner
     */
    function hardReset() public onlyOwner {
        resetsContract();
    }

    /**
     * @notice Private function to clean up and reset raffle state
     */
    function resetsContracts() private {
        for (uint256 i = 0; i < playerSelector.length; i++) {
            entryCount[playerSelector[i]] = 0;
        }
        delete playerSelector;
        raffleStatus = false;
        totalEntries = 0;
        entryFee = 0;
        fixedPrizeAmount = 0;
        requiredEntries = 0;
    }

    /**
     * @notice Private function to clean up and reset raffle state (owner-only version)
     */
    function resetsContract() private onlyOwner {
        for (uint256 i = 0; i < playerSelector.length; i++) {
            entryCount[playerSelector[i]] = 0;
        }
        delete playerSelector;
        raffleStatus = false;
        totalEntries = 0;
        entryFee = 0;
        fixedPrizeAmount = 0;
        requiredEntries = 0;
    }

    /**
     * @notice Allows the owner to withdraw the contract balance
     * @dev Can only be called when no raffle is active, and ensures enough balance for fixed prize
     */
    function withdrawBalance() public onlyOwner {
        require(!raffleStatus, "Cannot withdraw before raffle has ended.");
        uint256 balance = address(this).balance;
        require(balance > fixedPrizeAmount, "Need to ensure prize coverage.");
        payable(owner).transfer(balance);
        emit BalanceWithdrawn(balance);
    }

    /**
     * @notice Allows the owner to deposit funds into the contract
     */
    function initialDeposit() external payable onlyOwner {}

    /**
     * @notice Generates a pseudorandom number for winner selection
     * @dev Uses block properties, player count, and contract address for randomness
     * @return A pseudorandom uint256 value
     */
    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        playerSelector.length,
                        address(this)
                    )
                )
            );
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
