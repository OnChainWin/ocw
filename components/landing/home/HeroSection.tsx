"use client";
import React from "react";

import { RiGamepadLine, RiGuideLine } from "react-icons/ri";

import Link from "next/link";
import LottieHero from "./LottieHero";

import { Fade } from "react-awesome-reveal";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative z-0 flex flex-col items-center justify-between py-24 overflow-hidden">
      <svg
        className="absolute -z-20 left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-700 dark:stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)] opacity-20"
        aria-hidden="true">
        <defs>
          <pattern
            id="e813992c-7d03-4cc4-a2bd-151760b470a0"
            width="200"
            height="200"
            x="50%"
            y="-1"
            patternUnits="userSpaceOnUse">
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth="0"
          fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
        />
      </svg>

      <div className="grid container grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
          <Fade
            direction="down"
            triggerOnce={true}
            delay={200}
            cascade
            damping={1e-1}>
            <h1 className="text-3xl font-bold leading-10 md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
              {` Decentralized lottery for everyone `}
              <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">on </span>
              <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 bg-clip-text text-transparent">Base</span>
              <span>{" "}&{" "}</span> 
              <span className="bg-[#f1c88f] bg-clip-text text-transparent">Scroll</span>
            </h1>
            <div className="text-[18px] my-5 leading-10">
              <p className="mb-5">
                OnChainWin is a first community-centric giveaway and lottery
                platform that operates on-chain with total web3 transparency.
              </p>
              <p className="mb-5">
                Smart contracts collect funds, hold the funds securely,
                automatically specify the winners with web3 randomness, and
                distribute prizes to winners.
              </p>
              <p className="mb-5">
                Play now to experience a fully decentralized lottery world
                without any human touch or manipulation.
              </p>
            </div>
          </Fade>

          <Fade
            direction="left"
            triggerOnce={true}
            delay={200}
            cascade
            damping={1e-1}>
            <div className="flex items-center gap-3">
              <Link
                href={"/play"}
                className="bg-gradient-to-r to-orange-500 from-violet-300 p-[1px] rounded-full transition-all duration-300 hover:from-orange-500 hover:to-violet-600">
                <button className="px-3 text-xs md:px-8 py-3 md:py-4 bg-[#0a0a0a] rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-[#fff] no-underline transition-all duration-200 ease-out md:font-semibold flex items-center gap-2 hover:gap-4">
                  <span>Play Now</span>
                  <RiGamepadLine size={16} />
                </button>
              </Link>

              <Link
                href="/profile"
                role="button"
                className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-300 text-black px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider no-underline transition-all duration-200 ease-out hover:text-black/80 hover:no-underline md:font-semibold">
                <span>Invite a Friend</span>
                <RiGuideLine />
              </Link>
            </div>
          </Fade>
        </div>

        <div className="flex flex-row order-1 lg:order-2 relative rounded-lg">
          {/* <div className="sm:absolute sm:top-45 sm:z-10 sm:-right-40">
            <AnimationLottie animationPath={herolottie} />
          </div> */}
          <div className="lg:absolute lg:z-0 lg:top-10 sm:size-6/12 justify-center flex lg:size-full">
            <LottieHero />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
