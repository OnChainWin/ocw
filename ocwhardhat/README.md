# OCW Smart Contracts

This repository contains the blockchain technology powering the OCW-Hacken platform - a set of smart contracts that enable transparent, fair, and automated raffles and prize distributions on Ethereum.

## Raffle Ecosystem

The OCW-Hacken platform implements multiple specialized raffle types to address different use cases:

### FreeTimerOnChainWin
**Free Entry, Time-Based Raffle**
- Users enter without paying any fee
- Automatic termination after a pre-defined period
- Random winner selection driven by blockchain randomness
- Ideal for promotional campaigns, community airdrops, and audience engagement

### NYOnChainWin
**Paid Entry with Dynamic Prize Pool**
- Entry requires ETH payment
- Prize pool grows with each entry (contribution-based)
- Configurable target prize amount
- Raffle ends when either target amount is reached or time expires
- 5% platform commission on entries for sustainability

### OCW_USDC_ERC20
**Platform Token Implementation**
- Standard ERC20 token for reward distribution
- USDC-compatible interface for familiarity
- Used as prizes in token-based raffles
- Can be integrated with external DeFi protocols

### OnChainWinB2B
**Business-Focused Fixed Prize Raffle**
- Fixed prize amount set at creation
- Requires specific number of entries to complete
- Automatic winner selection when entry threshold is reached
- Suitable for business promotions with predetermined budgets
- Fully transparent mechanics for regulatory compliance

### TokenOnChainWinPTA
**Multi-Currency Entry with Token Rewards**
- Accept entries via ETH, USDC, or USDT
- Winners receive ERC20 token rewards
- Configurable entry fees per currency
- Time-limited operation with automatic termination
- Suitable for token launches and reward distributions

## Technical Implementation Details

### Random Winner Selection
The contracts use a combination of block variables and user addresses to generate unpredictable but verifiable random selections. Winner selection operates trustlessly and cannot be manipulated by any single entity.

### Financial Mechanisms
- Entry fees can be paid in ETH and in some cases stablecoins (USDC/USDT)
- Prize pools accumulate from entry fees or are pre-funded by raffle creators
- Withdrawal functions include ownership verification to protect funds
- Emergency reset functions available for system recovery

### Administration Features
- Owner-only setup and configuration
- Automated winner selection and prize distribution
- Comprehensive event logging for transparency
- System state monitoring with detailed status reporting
- Efficient use of gas through optimized storage patterns

### Security First Approach
The contracts implement multiple security measures:
- Reentrancy protections with checks-effects-interactions pattern
- Overflow/underflow prevention with Solidity ^0.8.0
- Critical function access control through ownership validation
- State machine patterns to enforce correct operation sequence

## Setup and Development

To set up the development environment:

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile
```

## Testing

The project includes comprehensive test suites for each contract:

```bash
# Run all tests
npx hardhat test

# Run tests for a specific contract
npx hardhat test test/FreeTimerOnChainWin.test.js
npx hardhat test test/NYOnChainWin.test.js
npx hardhat test test/OnChainWinB2B.test.js
npx hardhat test test/TokenOnChainWinPTA.test.js

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test
```

## Deployment

To deploy the contracts to a network:

```bash
# Start a local node
npx hardhat node

# Deploy using Hardhat Ignition
npx hardhat ignition deploy ./ignition/modules/Deploy.js
```

## Contract Documentation

All contracts include comprehensive NatSpec documentation, providing details about functions, parameters, and behavior. You can generate documentation from these comments using tools like Solidity Documentation Generator.

## License

These contracts are provided under the MIT License.
