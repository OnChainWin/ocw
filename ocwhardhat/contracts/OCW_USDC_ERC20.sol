// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

/**
 * @title OCW_USDC
 * @notice ERC20 token implementation for OnChainWin platform
 * @dev Implements various ERC20 extensions including burnability, permit, and flash minting
 */
contract OCW_USDC is
    ERC20,
    ERC20Burnable,
    ERC20Permit,
    Ownable,
    ERC20FlashMint
{
    /**
     * @notice Initializes the token with a name, symbol, and initial supply
     * @dev Mints 700,000 tokens (multiplied by 10^decimals) to the contract deployer
     */
    constructor() ERC20("OCW_USDC", "OCW_USDC") ERC20Permit("OCW_USDC") {
        _mint(msg.sender, 700000 * 100 ** decimals());
    }

    /**
     * @notice Allows the owner to mint additional tokens
     * @param to Address to receive the newly minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
