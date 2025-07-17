"use client";
import BaseSwitcher from "@/components/LotteryArea/(base)/BaseSwitcher";
import OcwBeeezoMultipleWinners from "@/components/LotteryArea/(base)/OcwBeezoMultipleWinners";
import { CardStackDemo } from "@/components/LotteryWP";
import Sidebar from "@/components/Sidebar";
import VerifyEmailArea from "@/components/VerifyEmail";
import Spinner from "@/components/Spinner";
import React, {
  Suspense,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useAccount, useChainId } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FiX, FiCheckCircle, FiExternalLink } from "react-icons/fi";
import Image from "next/image";

type Props = {};

const BeezoOcwPage = (props: Props) => {
  const chainId = useChainId();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

  const closeWelcomePopup = () => {
    setShowWelcomePopup(false);
  };

  const resetAuth = () => {
    setIsAuthenticated(false);
    setShowWelcomePopup(true);
    console.log("Authentication reset");
  };

  const handlePasswordSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!password || password.trim() === "") {
        setError("Please enter an access code!");
        return;
      }

      if (password.length !== 4) {
        setError("Access code must be 4 digits!");
        setPassword("");
        setTimeout(() => setError(""), 3000);
        return;
      }

      if (password === "1234") {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Incorrect password! Please try again.");
        setPassword("");
        setTimeout(() => setError(""), 3000);
      }
    },
    [password],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^\d+$/.test(value)) {
        setPassword(value);
        if (error) setError("");
      }
    },
    [error],
  );

  const passwordDots = useMemo(
    () =>
      [...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-colors duration-150 ${
            i < password.length
              ? "dark:bg-orange-400 bg-orange-500 shadow-lg"
              : "dark:bg-gray-600 bg-gray-300"
          }`}
        />
      )),
    [password.length],
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1f4df] via-[#e8f0c7] to-[#d4d4d4] flex items-center justify-center dark:bg-[#2b2b2b] bg-[#f1f4df] transition-all ease-in duration-200">
        <AnimatePresence>
          {showWelcomePopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-2xl p-8 dark:bg-[#2b2b2b] bg-white rounded-2xl shadow-2xl border dark:border-white/10 border-black/10 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={closeWelcomePopup}
                  className="absolute top-4 right-4 p-2 hover:text-orange-500 transition-colors rounded-full">
                  <FiX size={24} />
                </button>

                <div className="text-center mb-6">
                  <div className="flex justify-center">
                    <Image
                      src={"/logo.png"}
                      alt="logo"
                      width={64}
                      height={64}
                      priority
                    />
                  </div>
                  <h2 className="text-3xl font-bold dark:text-white text-gray-800 mb-2">
                    Welcome to OnChainWin X Beeezo Raffle
                  </h2>
                  <p className="dark:text-gray-300 text-gray-600 text-lg">
                    This raffle is running fully on-chain with full
                    transparency. OnChainWin smart contracts will specify the
                    winners and distribute the prizes automatically.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold dark:text-white text-gray-800 mb-4">
                    How to Join
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 font-mono rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <span className="dark:text-gray-300 text-gray-700">
                        Connect your wallet
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 font-mono rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <span className="dark:text-gray-300 text-gray-700">
                        Switch to Base Network
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 font-mono rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                      <span className="dark:text-gray-300 text-gray-700">
                        Click the "Buy Ticket" button
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 font-mono rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        4
                      </div>
                      <span className="dark:text-gray-300 text-gray-700">
                        Confirm the transaction with your wallet
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 font-mono rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        5
                      </div>
                      <span className="dark:text-gray-300 text-center text-gray-700">
                        See your ticket in the "My Tickets" section
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-8 p-4 dark:bg-orange-500/10 bg-orange-50 rounded-xl border dark:border-orange-500/20 border-orange-200">
                  <p className="dark:text-orange-300 text-orange-700 text-sm">
                    <strong>*PS:</strong> Nothing needs to be paid except for
                    gas fees.{" "}
                    <a
                      href="https://www.coinbase.com/en-de/learn/crypto-basics/what-are-gas-fees"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 underline inline-flex items-center gap-1">
                      Click here to learn more about gas fees and why they're
                      needed
                      <FiExternalLink size={12} />
                    </a>
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="w-full flex justify-center">
                    <ConnectButton.Custom>
                      {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                      }) => {
                        const ready =
                          mounted && authenticationStatus !== "loading";
                        const connected =
                          ready &&
                          account &&
                          chain &&
                          (!authenticationStatus ||
                            authenticationStatus === "authenticated");

                        return (
                          <div
                            {...(!ready && {
                              "aria-hidden": true,
                              style: {
                                opacity: 0,
                                pointerEvents: "none",
                                userSelect: "none",
                              },
                            })}>
                            {(() => {
                              if (!connected) {
                                return (
                                  <button
                                    onClick={openConnectModal}
                                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-colors duration-150 shadow-lg">
                                    Connect Wallet
                                  </button>
                                );
                              }

                              if (chain.unsupported) {
                                return (
                                  <button
                                    onClick={openChainModal}
                                    className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-150 shadow-lg">
                                    Wrong Network
                                  </button>
                                );
                              }

                              return (
                                <div className="flex gap-3">
                                  <button
                                    onClick={openChainModal}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    {chain.hasIcon && (
                                      <div
                                        style={{
                                          background: chain.iconBackground,
                                          width: 12,
                                          height: 12,
                                          borderRadius: 999,
                                          overflow: "hidden",
                                          marginRight: 4,
                                          display: "inline-block",
                                        }}>
                                        {chain.iconUrl && (
                                          <img
                                            alt={chain.name ?? "Chain icon"}
                                            src={chain.iconUrl}
                                            style={{ width: 12, height: 12 }}
                                          />
                                        )}
                                      </div>
                                    )}
                                    {chain.name}
                                  </button>

                                  <button
                                    onClick={openAccountModal}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    {account.displayName}
                                    {account.displayBalance
                                      ? ` (${account.displayBalance})`
                                      : ""}
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      }}
                    </ConnectButton.Custom>
                  </div>

                  <button
                    onClick={closeWelcomePopup}
                    className="px-6 py-2 dark:hover:text-orange-500 hover:text-orange-500 transition-colors text-sm">
                    Continue to Raffle
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <div className="glow-container">
            <div className="glow-card relative dark:bg-[#2b2b2b]/90 bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl w-96 md:w-[450px] border dark:border-white/10 border-black/10">
              <div className="glows absolute inset-0 rounded-2xl" />

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 flex items-center justify-center">
                  <span className="text-2xl">🔐</span>
                </div>
                <h2 className="text-3xl font-bold dark:text-white text-gray-800 mb-2">
                  Access Required
                </h2>
                <p className="dark:text-gray-300 text-gray-600 text-sm">
                  Enter your access code to continue
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-3">
                    Access Code
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 dark:bg-[#1a1a1a] bg-gray-50 border-2 dark:border-gray-600 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white text-gray-800 text-lg tracking-[0.3em] transition-all duration-150"
                      placeholder="••••"
                      required
                      maxLength={4}
                      style={{
                        letterSpacing: showPassword ? "normal" : "0.3em",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-gray-500 hover:text-orange-500 transition-colors">
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  {!showPassword && (
                    <div className="flex justify-center mt-3 space-x-2">
                      {passwordDots}
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-150 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-[#2b2b2b]">
                  Access Portal
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="dark:text-gray-400 text-gray-500 text-xs">
                  Secured by OnChainWin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <div className="lg:flex hidden mr-10 fixed">
          <Sidebar />
        </div>
        <VerifyEmailArea />
        <div className="px-20 max-sm:px-4">
          {chainId == 534352 ? <BaseSwitcher /> : <OcwBeeezoMultipleWinners />}
          <CardStackDemo />
        </div>
      </div>
    </Suspense>
  );
};

export default BeezoOcwPage;
