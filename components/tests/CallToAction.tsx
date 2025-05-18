"use client";
import React, { RefObject, useEffect, useRef } from "react";
import WaitlistButton from "./custom/WaitlistButton";
import starsBg from "@/assets/stars.png";
import gridBg from "@/assets/grid-lines.png";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";

const useRelativeMousePosition = (to: RefObject<HTMLElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const updateMousePosition = (event: MouseEvent) => {
    if (!to.current) return;
    const { top, left } = to.current?.getBoundingClientRect();
    mouseX.set(event.x - left);
    mouseY.set(event.y - top);
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return [mouseX, mouseY];
};

type Props = {};

const CallToAction = (props: Props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const borderedDivRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundPositionY = useTransform(
    scrollYProgress,
    [0, 1],
    [-300, 300],
  );

  const [mouseX, mouseY] = useRelativeMousePosition(borderedDivRef);

  const maskImage = useMotionTemplate`radial-gradient(50% 50% at ${mouseX}px ${mouseY}px,black,transparent)`;
  return (
    <section className="py-20 md:py-24" ref={sectionRef}>
      <div className="container">
        <motion.div
          ref={borderedDivRef}
          animate={{
            backgroundPositionX: starsBg.width,
          }}
          transition={{
            repeat: Infinity,
            duration: 70,
            ease: "linear",
          }}
          className="border dark:border-white/15 border-black/15 py-24 rounded-xl overflow-hidden relative group"
          style={{
            backgroundPositionY,
            backgroundImage: `url(${starsBg.src})`,
          }}>
          <div
            className="absolute inset-0 bg-orange-500 bg-blend-overlay [mask-image:radial-gradient(50%_50%_at_50%_40%,black,transparent)] group-hover:opacity-0 transition duration-700"
            style={{ backgroundImage: `url(${gridBg.src})` }}
          />
          <motion.div
            className="absolute inset-0 bg-orange-500 bg-blend-overlay opacity-0 group-hover:opacity-100 transition duration-700"
            style={{
              maskImage,
              backgroundImage: `url(${gridBg.src})`,
            }}
          />
          <div className="relative">
            <h2 className="text-5xl md:text-6xl max-w-md mx-auto tracking-tighter text-center font-medium">
              Ready to Join?
            </h2>
            <p className="text-center md:text-xl max-w-xs mx-auto text-lg dark:text-white/70 px-4 mt-5 tracking-tight text-black/70">
              Find the active raffles and grab your tickets to participate.
            </p>
            <div className="flex justify-center mt-8 gap-8">
              <Link href={"/"}>
                <WaitlistButton>Play Now</WaitlistButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
