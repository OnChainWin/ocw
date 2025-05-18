import { Button } from "@/components/ui/button";
import { useSwitchChain } from "wagmi";
import { motion } from "framer-motion";
import Image from "next/image";
import { RiArrowRightLine } from "react-icons/ri";
import { FaEthereum } from "react-icons/fa";

const BaseSwitcher = () => {
  const { switchChain } = useSwitchChain();

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-8 text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="mb-8"></motion.div>

        <h2 className="text-3xl font-bold mb-4">
          Switch to Base Network
        </h2>

        <p className="text-gray-500 mb-8">
          This raffle is running on Base Network. To participate, you'll need to
          switch your network.
        </p>

        <Button
          onClick={() => switchChain({ chainId: 8453 })}
          className="justify-center bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 items-center gap-2">
          Switch to Base
          <RiArrowRightLine className="w-5 h-5" />
        </Button>

        <div className="mt-8 text-gray-400 text-sm">
          <p>Make sure you have Base Network configured in your wallet.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BaseSwitcher;
