import Image from "next/image";
import React from "react";

import GlowCard from "../helper/glow-card";

import { XIcon } from "lucide-react";
import { FaDiscord, FaMediumM, FaTelegram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import Link from "next/link";

const aboutOCW = [
  {
    id: 1,
    title: "Whitepaper",
    image: "/logo.png",
    description: "",
    link: "https://onchainwin.com/ocwwhitepaper.pdf",
  },
  {
    id: 2,
    title: "X",
    image: BsTwitterX, // JSX öğesi değil, bileşen referansı
    description: "@OnChainWinX",
    link: "https://x.com/OnChainWinX",
  },
  {
    id: 3,
    title: "Discord",
    image: FaDiscord, // JSX öğesi değil, bileşen referansı
    description: "Discord",
    link: "https://discord.gg/SufJnfDkN6",
  },
];

const contractOCW = [
  {
    id: 1,
    title: "Historical Data",
    image: "/logo.png",
    description: "",
    link: "https://onchainwin.com/historicaldata",
  },
  {
    id: 2,
    title: "Medium",
    image: FaMediumM, // JSX öğesi değil, bileşen referansı
    description: "@OnChainWin",
    link: "https://medium.com/@onchainwin",
  },
  {
    id: 3,
    title: "Telegram",
    image: FaTelegram, // JSX öğesi değil, bileşen referansı
    description: "@OnChainWin",
    link: "https://t.me/onchainwin",
  },
];

const UsSection = () => {
  return (
    <section className="container relative z-50 border-t my-12 lg:my-24 border-black dark:border-white">
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-volet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="text-orange-500 text-[24px] my-24 flex justify-center uppercase tracking-widest">
        ▶︎ About Us ◀︎
      </div>

      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col gap-6">
            {aboutOCW.map((item) => (
              <GlowCard key={item.id} identifier={`award-${item.id}`}>
                <Link href={item.link} target="_blank">
                  <div className="p-3 relative">
                    <div className="flex justify-end absolute right-0 mr-5 mt-3">
                      {item.description !== "" ? (
                        <p className="text-xs sm:text-sm bg-orange-500 rounded-full text-white font-bold px-3 py-2">
                          {item.description}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="flex items-center gap-x-8 px-3 py-2">
                      {typeof item.image === "string" ? (
                        <Image
                          src={item.image}
                          alt="Placeholder"
                          width={200}
                          height={200}
                          className="hover:scale-125 transition-all duration-500 rounded-xl size-12 "
                        />
                      ) : (
                        React.createElement(item.image, {
                          className:
                            "text-orange-500 hover:text-orange-700 size-12",
                        })
                      )}
                      <div>
                        <p className="text-base sm:text-xl font-medium uppercase hover:scale-110 transition-all duration-500">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </GlowCard>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {contractOCW.map((item) => (
              <GlowCard key={item.id} identifier={`experience-${item.id}`}>
                <Link href={item.link} target="_blank">
                  <div className="p-3 relative">
                    <div className="flex justify-end absolute right-0 mr-5 mt-3">
                      {item.description !== "" ? (
                        <p className="text-xs sm:text-sm bg-orange-500 rounded-full text-white font-bold px-3 py-2">
                          {item.description}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="flex items-center gap-x-8 px-3 py-2">
                      {typeof item.image === "string" ? (
                        <Image
                          src={item.image}
                          alt="Placeholder"
                          width={200}
                          height={200}
                          className="hover:scale-125 transition-all duration-500 rounded-xl size-12 "
                        />
                      ) : (
                        React.createElement(item.image, {
                          className:
                            "text-orange-500 hover:text-orange-700 size-12",
                        })
                      )}
                      <div>
                        <p className="text-base sm:text-xl font-medium uppercase hover:scale-110 transition-all duration-500">
                          {item.title}
                        </p>
                        {/* <p className="text-sm sm:text-base">{item.process}</p> */}
                      </div>
                    </div>
                  </div>
                </Link>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsSection;
