"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultConfig,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { scroll, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Theming from "@/theme/Theming";
import Navbar, { NavbarMain } from "@/components/Navbar";
import { usePathname } from "next/navigation";

const { wallets } = getDefaultWallets();

const WALLET_CONNECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || "";

const config = getDefaultConfig({
  appName: "OnChainWin",
  projectId: WALLET_CONNECT_ID,
  chains: [base, scroll],
  wallets: [...wallets],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions={true}
          theme={darkTheme({
            accentColor: "#7C3AED",
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small",
          })}
          locale="en-US">
          <Theming>
            {pathname === "/" ? <NavbarMain /> : <Navbar />}
            {children}
          </Theming>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
