// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// \\
// Created by Clodron
// If you want to create a new project, please contact me @
// info@clodron.com
// \\

/**
 * @title TokenOnChainWinPTA
 * @notice A contract for running raffles with ERC20 token rewards and multiple payment options
 * @custom:security ReentrancyGuard to prevent reentrancy attacks
 */
contract TokenOnChainWinPTA is ReentrancyGuard {
    address public owner;
    address public rewardToken;
    uint256 public rewardAmount;
    mapping(address => uint256) public entryCount;
    address[] public winners;
    address[] public players;
    address[] private playerSelector;
    bool public raffleStatus;
    uint256 public entryFee;
    uint256 public entryFeeUSDT;
    uint256 public entryFeeUSDC;
    uint256 public totalEntries;
    uint256 public targetPrizeAmount;
    uint256 public raffleStartTime;
    uint256 public raffleDuration;
    address constant USDT = 0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2; // USDT token
    address constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // USDC token
    uint256 private raffleStartDuration;

    event NewEntry(address indexed player, uint256 numberOfEntries);
    event RaffleStarted(
        uint256 targetPrizeAmount,
        uint256 startTime,
        uint256 duration
    );
    event RaffleEnded(
        address winner,
        uint256 targetPrizeAmount,
        address rewardToken
    );

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
     * @param _targetPrizeAmount The target amount for the token prize
     * @param _durationInMinutes Duration of the raffle in minutes
     * @param _entryFee Cost per ticket in ETH
     * @param _entryFeeUSDT Cost per ticket in USDT
     * @param _entryFeeUSDC Cost per ticket in USDC
     * @param _rewardToken Address of the ERC20 token to be used as a reward
     */
    function setupRaffle(
        uint256 _targetPrizeAmount,
        uint256 _durationInMinutes,
        uint256 _entryFee,
        uint256 _entryFeeUSDT,
        uint256 _entryFeeUSDC,
        address _rewardToken
    ) public onlyOwner {
        require(!raffleStatus, "Raffle already in progress.");
        require(
            totalEntries == 0,
            "Cannot start a new raffle until the previous one has ended."
        );
        // require(_targetPrizeAmount >= _entryFee, "Invalid entry fee for ETH.");
        require(_durationInMinutes > 0, "Invalid duration.");
        require(_entryFee > 0, "Invalid entry fee for ETH.");
        require(_targetPrizeAmount > 0, "More than 0");
        targetPrizeAmount = _targetPrizeAmount;
        raffleDuration = _durationInMinutes * 1 minutes;
        entryFeeUSDT = _entryFeeUSDT;
        entryFeeUSDC = _entryFeeUSDC;
        entryFee = _entryFee;
        raffleStatus = true;
        raffleStartTime = block.timestamp;
        rewardToken = _rewardToken;
        raffleStartDuration = _durationInMinutes;
        emit RaffleStarted(targetPrizeAmount, raffleStartTime, raffleDuration);
    }

    /**
     * @notice Allows users to purchase raffle entries using ETH
     * @dev Includes a 5% commission fee on top of the entry fee
     * @param _numberOfEntries Number of entries to purchase
     */
    function buyEntry(uint256 _numberOfEntries) public payable {
        require(raffleStatus, "Raffle has not started or finished yet.");

        uint256 totalCostWithCommission = (entryFee * _numberOfEntries * 105) /
            100; // %5

        require(
            msg.value >= totalCostWithCommission,
            "You need to pay much more."
        );

        for (uint256 i = 0; i < _numberOfEntries; i++) {
            playerSelector.push(msg.sender);
        }
        entryCount[msg.sender] += _numberOfEntries;
        totalEntries += _numberOfEntries;
        emit NewEntry(msg.sender, _numberOfEntries);

        if (getRemainingTimeSec() == 0) {
            raffleStatus = false;
            selectWinners();
        }
    }

    /**
     * @notice Allows users to purchase raffle entries using USDT
     * @dev Includes a 5% commission fee on top of the entry fee
     * @param _numberOfEntries Number of entries to purchase
     */
    function buyEntryUSDT(uint256 _numberOfEntries) public payable {
        require(raffleStatus, "Raffle has not started or finished yet.");

        uint256 totalCostWithUSDTCommission = (entryFeeUSDT *
            _numberOfEntries *
            105) / 100; // %5

        require(totalCostWithUSDTCommission > 0, "Invalid entry fee for USDT.");
        require(
            IERC20(USDT).transferFrom(
                msg.sender,
                address(this),
                totalCostWithUSDTCommission
            ),
            "USDT transfer failed. Make sure you have approved the contract to spend your tokens."
        );

        for (uint256 i = 0; i < _numberOfEntries; i++) {
            playerSelector.push(msg.sender);
        }
        entryCount[msg.sender] += _numberOfEntries;
        totalEntries += _numberOfEntries;
        emit NewEntry(msg.sender, _numberOfEntries);

        if (getRemainingTimeSec() == 0) {
            raffleStatus = false;
            selectWinners();
        }
    }

    /**
     * @notice Allows users to purchase raffle entries using USDC
     * @dev Includes a 5% commission fee on top of the entry fee
     * @param _numberOfEntries Number of entries to purchase
     */
    function buyEntryUSDC(uint256 _numberOfEntries) public payable {
        require(raffleStatus, "Raffle has not started or finished yet.");

        uint256 totalCostWithUSDCCommission = (entryFeeUSDC *
            _numberOfEntries *
            105) / 100; // %5

        require(totalCostWithUSDCCommission > 0, "Invalid entry fee for USDC.");
        require(
            IERC20(USDC).transferFrom(
                msg.sender,
                address(this),
                totalCostWithUSDCCommission
            ),
            "USDC transfer failed. Make sure you have approved the contract to spend your tokens."
        );

        for (uint256 i = 0; i < _numberOfEntries; i++) {
            playerSelector.push(msg.sender);
        }
        entryCount[msg.sender] += _numberOfEntries;
        totalEntries += _numberOfEntries;
        emit NewEntry(msg.sender, _numberOfEntries);

        if (getRemainingTimeSec() == 0) {
            raffleStatus = false;
            selectWinners();
        }
    }

    /**
     * @notice Private function to select winners and distribute token prizes
     * @dev Called automatically when conditions are met (time expired)
     */
    function selectWinners() private {
        if (
            raffleStatus &&
            (block.timestamp >= raffleStartTime + raffleDuration)
        ) {
            raffleStatus = false;
        }

        require(
            block.timestamp >= raffleStartTime + raffleDuration,
            "Raffle is not yet ready to end."
        );
        require(playerSelector.length > 0, "No entries in the raffle.");
        require(
            !raffleStatus,
            "Raffle must be ended before selecting a winner."
        );

        uint256 winnerIndex = random() % playerSelector.length;
        address winner = playerSelector[winnerIndex];

        IERC20(rewardToken).transfer(winner, targetPrizeAmount);
        emit RaffleEnded(winner, targetPrizeAmount, rewardToken);

        winners.push(winner);

        resetsContracts();
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
        delete players;
        raffleStatus = false;
        totalEntries = 0;
        entryFee = 0;
        entryFeeUSDC = 0;
        entryFeeUSDT = 0;
        targetPrizeAmount = 0;
    }

    /**
     * @notice Private function to clean up and reset raffle state (owner-only version)
     */
    function resetsContract() private onlyOwner {
        for (uint256 i = 0; i < playerSelector.length; i++) {
            entryCount[playerSelector[i]] = 0;
        }
        delete playerSelector;
        delete players;
        raffleStatus = false;
        totalEntries = 0;
        entryFee = 0;
        entryFeeUSDC = 0;
        entryFeeUSDT = 0;
    }

    /**
     * @notice Allows the owner to withdraw ETH from the contract
     * @dev Can only be called when no raffle is active
     */
    function withdrawBalance() public onlyOwner {
        require(!raffleStatus, "Cannot withdraw before raffle has ended.");
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw.");
        payable(owner).transfer(balance);
    }

    /**
     * @notice Allows the owner to withdraw ERC20 tokens from the contract
     * @dev Can only be called when no raffle is active, and only for USDT or USDC
     * @param token Address of the token to withdraw (USDT or USDC)
     */
    function withdrawTokenBalance(address token) public onlyOwner {
        require(!raffleStatus, "Cannot withdraw before raffle has ended.");

        require(
            token == address(USDT) || token == address(USDC),
            "Invalid token address."
        );

        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No token balance to withdraw.");

        require(
            IERC20(token).transfer(owner, balance),
            "Token transfer failed."
        );
    }

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
                        players.length,
                        address(this)
                    )
                )
            );
    }

    /**
     * @notice Checks if there's enough reward token balance in the contract
     * @return The balance of the reward token in the contract
     */
    function isThereRewardBalance() public view returns (uint256) {
        return IERC20(rewardToken).balanceOf(address(this));
    }

    /**
     * @notice Returns the total number of entries in the current raffle
     * @return Total entry count
     */
    function getTotalEntries() public view returns (uint256) {
        return totalEntries;
    }

    /**
     * @notice Allows the owner to deposit ETH into the contract
     */
    function initialDeposit() external payable onlyOwner {}

    /**
     * @notice Allows the owner to deposit USDT into the contract
     * @param _amount Amount of USDT to deposit
     */
    function usdtDeposit(uint256 _amount) external payable onlyOwner {
        IERC20 usdtToken = IERC20(USDT);

        require(
            usdtToken.transferFrom(msg.sender, address(this), _amount),
            "USDT transfer failed."
        );
    }

    /**
     * @notice Allows the owner to deposit USDC into the contract
     * @param _amount Amount of USDC to deposit
     */
    function usdcDeposit(uint256 _amount) external payable onlyOwner {
        IERC20 usdcToken = IERC20(USDC);

        require(
            usdcToken.transferFrom(msg.sender, address(this), _amount),
            "USDC transfer failed."
        );
    }

    /**
     * @notice Allows the owner to deposit any ERC20 token into the contract
     * @param token Address of the token to deposit
     * @param _amount Amount of tokens to deposit
     */
    function tokenDeposit(
        address token,
        uint256 _amount
    ) external payable onlyOwner {
        IERC20 tokenContract = IERC20(token);

        require(
            tokenContract.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed."
        );
    }

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
        require(index < winners.length, "No winner found.");
        return winners[index];
    }

    /**
     * @notice Returns the current ETH balance of the contract
     * @return Contract ETH balance in wei
     */
    function getContractETHBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Returns the balance of a specific token in the contract
     * @param token Address of the token to check
     * @return Token balance
     */
    function getTokenBalance(address token) public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    /**
     * @notice Returns the USDC balance of the contract
     * @return USDC balance
     */
    function getUSDCBalance() public view returns (uint256) {
        return IERC20(USDC).balanceOf(address(this));
    }

    /**
     * @notice Returns the USDT balance of the contract
     * @return USDT balance
     */
    function getUSDTBalance() public view returns (uint256) {
        return IERC20(USDT).balanceOf(address(this));
    }

    /**
     * @notice Returns the initial duration set for the current raffle
     * @return Duration in minutes
     */
    function getRaffleStartDuration() public view returns (uint256) {
        return raffleStartDuration;
    }

    /**
     * @notice Returns the address of the token used for rewards
     * @return Address of the reward token
     */
    function getRewardToken() public view returns (address) {
        return rewardToken;
    }
}
