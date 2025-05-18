"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Popup = () => {
  const account = useAccount();
  const [isOpen, setIsOpen] = useState<any>(false);

  useEffect(() => {
    if (account.address == undefined) setIsOpen(true);
  }, []);

  return (
    <div>
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const SpringModal = ({ isOpen, setIsOpen }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer">
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-black to-[#2b2b2b] text-white p-10 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden">
            <button
              className="absolute z-0 top-2 right-2 bg-white/20 p-1 rounded-full hover:scale-105 hover:ease-linear hover:duration-300"
              onClick={() => setIsOpen(false)}>
              <XIcon className="text-white text-[200px] " />
            </button>
            <div className="relative z-6">
              <div className="w-16 h-16 grid place-items-center mx-auto">
                <Image src="/logo.png" width={50} height={50} alt="logo" />
              </div>
              <h2 className="text-xl text-[#FEBD57] font-bold text-center mb-2">
                ⌁ The First Decentralized Web3 Raffle ⌁
              </h2>
              <ul className="text-left text-muted-foreground mb-4">
                <li className="mb-2">⚬ Fully automated draws</li>
                <li className="mb-2">
                  ⚬ Secure and transparent smart contract and transaction
                  history
                </li>
                <li className="mb-2">
                  ⚬ Have the winning prize directly to your wallet in seconds
                </li>
                <li className="mb-2">
                  ⚬ No human / admin interactions or possibility of any
                  manipulations
                </li>
              </ul>
              <span>From Community to Community!</span>
              <div className="flex w-full h-full justify-center mt-5">
                <ConnectButton />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
