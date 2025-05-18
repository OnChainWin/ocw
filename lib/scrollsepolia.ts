// const RPC = process.env.NEXT_PUBLIC_ALCHEMY_RPC || "";
const SCROLL_RPC = process.env.NEXT_PUBLIC_SCROLL_RPC || "";

export const scrollChain = {
  id: 534352,
  name: "Scroll",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [SCROLL_RPC],
    },
  },
  blockExplorers: {
    default: {
      name: "ScrollScan",
      url: "https://scrollscan.com",
      apiUrl: "https://api.scrollscan.com/api",
    },
  },
  contracts: {
    // multicall3: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11" as `0x${string}`,
      blockCreated: 3769860,
    },
  },
  testnet: false,
};
