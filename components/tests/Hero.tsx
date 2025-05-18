"use client";
import React, { useRef } from "react";
import WaitlistButton from "./custom/WaitlistButton";
import starsBg from "@/assets/stars.png";
import { motion, useScroll, useTransform } from "framer-motion";

type Props = {};

const Hero = (props: Props) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundPositionY = useTransform(
    scrollYProgress,
    [0, 1],
    [-300, 300],
  );

  return (
    <motion.section
      ref={sectionRef}
      className="h-[555px] flex items-center overflow-hidden relative"
      style={{ backgroundImage: `url(${starsBg.src})`, backgroundPositionY }}
      animate={{
        backgroundPositionX: starsBg.width,
      }}
      transition={{
        repeat: Infinity,
        duration: 120,
        ease: "linear",
      }}>
      <div className="absolute inset-0 bg-[radial-gradient(65%_65%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)] md:bg-[radial-gradient(44%_55%_at_center_center,rgb(140,69,255,.5)_15%,rgb(14,0,36,.5)_78%,transparent)]"></div>
      {/* circle */}
      <div className="absolute h-64 w-64 bg-purple-500 rounded-full border border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(50%_50%_at_16.8%_18.3%,white,rgb(184,148,255)_37.7%,rgb(24,0,66))] shadow-[-20px_-20px_50px_rgb(255,255,255,.5),-20px_-20px_80px_rgb(255,255,255,.1),0_0_50px_rgb(140,69,255)]"></div>
      {/* 1.ci ring */}
      <motion.div
        style={{ translateY: "-50%", translateX: "-50%" }}
        animate={{
          rotate: "1turn",
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[344px] w-[344px] border border-white opacity-20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute h-2 w-2 left-0 bg-white rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 "></div>
        <div className="absolute h-2 w-2 left-1/2 bg-white rounded-full top-0 -translate-x-1/2 -translate-y-1/2 "></div>
        <div className="absolute h-5 w-5 left-full border border-white rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center ">
          <div className="h-2 w-2 bg-white rounded-full"></div>
        </div>
      </motion.div>
      {/* 2.ci ring */}
      <motion.div
        style={{ translateY: "-50%", translateX: "-50%" }}
        animate={{
          rotate: "-1turn",
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[444px] w-[444px] rounded-full border border-white/20 top-1/2  left-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed"></motion.div>
      {/* 3.cü ring */}
      <motion.div
        style={{ translateY: "-50%", translateX: "-50%" }}
        animate={{
          rotate: "1turn",
        }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-[544px] w-[544px] rounded-full border border-white opacity-40 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="absolute h-2 w-2 left-0 bg-white rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 "></div>
        <div className="absolute h-5 w-5 left-full border border-purple-300  rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center">
          <div className="h-2 w-2 bg-purple-300 rounded-full"></div>
        </div>
      </motion.div>
      <div className="container relative mt-16">
        <h1 className="sm:text-7xl text-5xl font-semibold tracking-tighter bg-white bg-[radial-gradient(100%_100%_at_top_left,white,white,rgb(74,32,138,.5))] text-transparent bg-clip-text text-center">
          Clodron AI SaaS
        </h1>
        <p className="text-lg md:text-xl text-white/70 mt-5 text-center max-w-3xl mx-auto">
          The future of AI. Elevate your business with Clodron. This is where
          the future of AI meets the future of business.
        </p>
        <div className="flex justify-center mt-5">
          <WaitlistButton>Join waitlist</WaitlistButton>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
