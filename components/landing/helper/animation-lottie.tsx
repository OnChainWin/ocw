"use client";

import Lottie from "lottie-react";

import React from "react";

const AnimationLottie = ({
  animationPath,
}: //   width,
{
  animationPath: unknown;
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: "100%",
    },
  };
  return <Lottie {...defaultOptions} />;
};

export default AnimationLottie;
