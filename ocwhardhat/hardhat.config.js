require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

const dotenv = require("dotenv");
dotenv.config();

function privateKey() {
  return process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];
}

function privateKeyBase() {
  return process.env.PRIVATE_KEY_BASE !== undefined
    ? [process.env.PRIVATE_KEY_BASE]
    : [];
}

function privateKeyWallet6() {
  return process.env.PRIVATE_WALLET6_KEY !== undefined
    ? [process.env.PRIVATE_WALLET6_KEY]
    : [];
}

function privateKeyBaseOCW() {
  return process.env.PRIVATE_BASE_OCW !== undefined
    ? [process.env.PRIVATE_BASE_OCW]
    : [];
}

function privateKeyHyperliquid() {
  return process.env.PRIVATE_KEY_HYPERLIQUID !== undefined
    ? [process.env.PRIVATE_KEY_HYPERLIQUID]
    : [];
}
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    mumbai: {
      // url: "https://polygon-mumbai-pokt.nodies.app",
      url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
      accounts: privateKey(),
    },
    sepolia: {
      url: "https://sepolia.drpc.org",
      accounts: privateKey(),
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: privateKey(),
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: privateKeyBase(),
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: privateKey(),
    },
    scroll: {
      url: "https://rpc.scroll.io/",
      accounts: privateKey(),
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: privateKeyWallet6(),
    },
    hyperliquid: {
      url: "https://rpc.hyperliquid.xyz/evm",
      accounts: privateKeyHyperliquid(),
      chainId: 999,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
      {
        version: "0.8.30",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode", "evm.deployedBytecode"],
        },
      },
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: {
      scroll: process.env.API_KEY,
      base: process.env.BASE_API_KEY,
    },

    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com/",
        },
      },
      {
        network: "goerli",
        chainId: 5,
        urls: {
          apiURL: "https://api-goerli.etherscan.io/api",
          browserURL: "https://goerli.etherscan.io",
        },
      },
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com/",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org/",
        },
      },
      {
        network: "hyperliquid",
        chainId: 999,
      },
    ],
  },
  sourcify: {
    enabled: true,
    // apiUrl: "https://sourcify.parsec.finance",
  },
};
