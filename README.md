# OCW: On-Chain Win Platform is a blockchain-based raffle and reward distribution platform connecting users with various types of prize draws through smart contracts on Ethereum.

## What It Does

The platform enables multiple types of raffles and prize distributions:
- Free time-limited raffles
- Paid entry raffles with growing prize pools
- Business-focused raffles with fixed prizes
- Token reward raffles with multiple payment options

All raffle mechanics are fully transparent and provably fair, as they operate directly on-chain.

## Technology Stack

### Frontend
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS for responsive design
- **Web3 Integration**: ethers.js for blockchain interaction
- **State Management**: React Context API

### Smart Contracts
- **Blockchain**: Ethereum
- **Development**: Solidity with Hardhat
- **Testing**: Comprehensive test suite using Chai
- **Design Pattern**: Modular contract system with specialized raffle types

## Contract Functionality

### FreeTimerOnChainWin
Allows users to enter raffles without payment. Winners are selected randomly after a predefined time period expires. Ideal for promotional giveaways.

### NYOnChainWin
A paid raffle system where users purchase entries with ETH. The prize pool grows with each entry, and the raffle ends either when the target prize amount is reached or when the time expires.

### OCW_USDC_ERC20
Custom ERC20 token implementation for the platform, used for rewards distribution and potentially as payment for entries.

### OnChainWinB2B
Business-focused raffle with fixed prize amounts. The contract requires a specific number of entries before selecting a winner, making it suitable for controlled promotions.

### TokenOnChainWinPTA
Advanced raffle that accepts multiple payment methods (ETH, USDC, USDT) and distributes ERC20 token rewards to winners. Offers flexibility for users with different cryptocurrencies.

## Security & Fairness

The platform prioritizes:
- Transparent winner selection using blockchain-based randomness
- Secure fund management with protection against common attack vectors
- Fair distribution mechanisms with verifiable on-chain execution
- Access controls limiting administrative functions to authorized addresses
