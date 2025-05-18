"use client";
import {
  DotLottieCommonPlayer,
  DotLottiePlayer,
} from "@dotlottie/react-player";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";
import BgProject from "@/public/raffle.png";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";

type Props = {};

const tabs = [
  {
    icon: "/lottie/wallet.lottie",
    title: "Connect Your Wallet",
    isNew: false,
    backgroundPositionX: 102,
    backgroundPositionY: 1,
    backgroundSizeX: 225,
  },
  {
    icon: "/lottie/click.lottie",
    title: "Buy Your Ticket",
    isNew: false,
    backgroundPositionX: 30,
    backgroundPositionY: 80,
    backgroundSizeX: 300,
  },
  {
    icon: "/lottie/stars.lottie",
    title: "Wait for the Results",
    isNew: true,
    backgroundPositionX: 60,
    backgroundPositionY: 40,
    backgroundSizeX: 250,
  },
];

const FeatureTab = (
  props: (typeof tabs)[number] &
    ComponentPropsWithoutRef<"div"> & { selected: boolean },
) => {
  const tabRef = useRef<HTMLDivElement>(null);
  const dotLottieRef = useRef<DotLottieCommonPlayer>(null);
  const xPercentage = useMotionValue(0);
  const yPercentage = useMotionValue(0);

  const maskImage = useMotionTemplate`radial-gradient(80px 80px at ${xPercentage}% ${yPercentage}%, black, transparent)`;

  useEffect(() => {
    if (!tabRef.current || !props.selected) return;

    xPercentage.set(0);
    yPercentage.set(0);
    const { height, width } = tabRef.current?.getBoundingClientRect();
    const circumference = height * 2 + width * 2;

    const times = [
      0,
      width / circumference,
      (width + height) / circumference,
      (width * 2 + height) / circumference,
      1,
    ];
    animate(xPercentage, [0, 100, 100, 0, 0], {
      times,
      duration: 4,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    });

    animate(yPercentage, [0, 0, 100, 100, 0], {
      times,
      duration: 4,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    });
  }, [props.selected]);

  const handleTabHover = () => {
    if (dotLottieRef.current === null) return;
    dotLottieRef.current.seek(0);
    dotLottieRef.current.play();
  };
  return (
    <div
      ref={tabRef}
      onMouseEnter={handleTabHover}
      className="border dark:border-white/15 border-black/15 flex p-2.5 rounded-xl gap-2.5 items-center lg:flex-1  relative"
      onMouseMove={props.onMouseMove}>
      {props.selected && (
        <motion.div
          style={{ maskImage }}
          className="absolute -m-px inset-0 border border-orange-400 rounded-xl "></motion.div>
      )}

      <div className="h-12 w-12 border bg-neutral-800 dark:border-white/15 border-black/15 rounded-lg inline-flex items-center justify-center">
        <DotLottiePlayer
          ref={dotLottieRef}
          src={props.icon}
          className="h-5 w-5 "
          autoplay
        />
      </div>
      <div className="font-medium">{props.title}</div>
      {props.isNew && (
        <div className="text-xs rounded-full px-2 py-0.5 bg-orange-400 text-black font-semibold">
          and Win
        </div>
      )}
    </div>
  );
};

const Features = (props: Props) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const backgroundPositionX = useMotionValue(tabs[0].backgroundPositionX);
  const backgroundPositionY = useMotionValue(tabs[0].backgroundPositionY);
  const backgroundSizeX = useMotionValue(100); // Başlangıçta %100
  const backgroundPosition = useMotionTemplate`${backgroundPositionX}% ${backgroundPositionY}%`;
  const backgroundSize = useMotionTemplate`${backgroundSizeX}% auto`;

  const handleSelectedTab = (index: number) => {
    setSelectedTab(index);

    // Sadece hover sırasında zoom yap
    animate(
      backgroundSizeX,
      [100, tabs[index].backgroundSizeX], // Başlangıçta %100, hoverda istenilen boyut
      {
        duration: 2,
        ease: "easeInOut",
      },
    );

    animate(
      backgroundPositionX,
      [backgroundPositionX.get(), tabs[index].backgroundPositionX],
      {
        duration: 2,
        ease: "easeInOut",
      },
    );

    animate(
      backgroundPositionY,
      [backgroundPositionY.get(), tabs[index].backgroundPositionY],
      {
        duration: 2,
        ease: "easeInOut",
      },
    );
  };
  return (
    <section className="py-20 md:py-24 ">
      <div className="container">
        <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter">
          Every Win is Just a Click Away
        </h2>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto tracking-tight text-center mt-5">
          OnChainWin provides fully automated and decentralized raffle
          experience without any human touch or manipulation. Change the trust
          with transparency; play, win and repeat securely with the real power
          of web3.
        </p>
        <div className="mt-10 flex flex-col lg:flex-row gap-3">
          {tabs.map((tab, tabIndex) => (
            <FeatureTab
              {...tab}
              selected={selectedTab === tabIndex}
              onMouseMove={() => handleSelectedTab(tabIndex)}
              key={tab.title}
            />
          ))}
        </div>
        <div className="border border-white/20 p-2.5 rounded-xl mt-3">
          <motion.div
            className="aspect-video bg-cover border border-white/20 rounded-lg"
            style={{
              backgroundPosition: backgroundPosition,
              backgroundSize: backgroundSize,
              backgroundImage: `url(${BgProject.src})`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
