import { createPublicClient, http } from "viem";
// import { mumbai } from "./mumbai";
import { scroll, base } from "viem/chains";
// import { scrollChain } from "./scrollsepolia";

export const publicClient = createPublicClient({
  chain: base,
  // chain: scrollChain,
  // chain: mumbai,
  // chain: scrollSepolia,
  // transport: http(process.env.NEXT_PUBLIC_SCROLL_RPC),
  transport: http("https://mainnet.base.org"),
});
