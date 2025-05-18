"use client";

import { DotLottiePlayer } from "@dotlottie/react-player";
import React from "react";

function LottieHero() {
  return (
    <div>
      <DotLottiePlayer src={"/lottie/ethereum.lottie"} autoplay loop />
    </div>
  );
}

export default LottieHero;
