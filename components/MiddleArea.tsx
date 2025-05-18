import Image from "next/image";
import { Sparkles } from "lucide-react";
import { FaGasPump, FaTicketAlt } from "react-icons/fa";

const MiddleArea = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[500px] md:min-h-[600px] py-8 relative px-4">
      {/* Logo */}
      <div className="relative -top-20 md:-top-24 left-4 mb-[-60px] md:mb-[-80px]">
        <Image
          src={"/ocwnewyear.png"}
          alt="ocw"
          width={200}
          height={200}
          className="hover:scale-110 transition-transform duration-300 w-[160px] h-[160px] md:w-[200px] md:h-[200px]"
        />
      </div>

      {/* Cards Container */}
      <div className="flex flex-col items-center space-y-3 w-full max-w-[280px] md:max-w-[320px]">
        {/* Ticket Price Card */}
        <div className="w-full bg-white/95 backdrop-blur-sm rounded-xl border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] px-4 py-4 md:py-5">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FaTicketAlt className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <span className="text-gray-700 text-sm md:text-base font-medium">
              Ticket Price
            </span>
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 animate-pulse" />
          </div>

          <div className="text-center">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              0.001 ETH
            </span>
            <span className="block text-xs md:text-sm text-gray-500">(Estimated 3.5$)</span>
          </div>
        </div>

        {/* Gas Fee Card */}
        <div className="w-full bg-white/95 backdrop-blur-sm rounded-xl border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] px-4 py-4 md:py-5">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FaGasPump className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <span className="text-gray-700 text-sm md:text-base font-medium">
              Estimated Gas Fee
            </span>
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 animate-pulse" />
          </div>

          <div className="text-center">
            <div className="flex items-baseline justify-center">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                0.1
              </span>
              <span className="text-gray-600 text-sm md:text-base font-medium ml-1">
                USD
              </span>
            </div>

            <div className="flex items-center justify-center space-x-1 mt-1">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs md:text-sm text-gray-500">Network Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Powered By Section */}
      <div className="flex items-center justify-center space-x-2 mt-6 mb-4 bg-white/50 px-3 py-1.5 rounded-full border border-purple-100">
        <span className="text-gray-800 text-sm font-medium">
          Powered by
        </span>
        <Image
          src={"/scrolllogo.png"}
          alt="scroll"
          width={120}
          height={120}
          className="hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default MiddleArea;
