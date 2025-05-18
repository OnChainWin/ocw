import React from "react";

type Props = {};

const WaitlistButton = (props: React.PropsWithChildren) => {
  return (
    <button className="relative py-2 px-5 rounded-lg font-medium text-sm bg-gradient-to-b from-[#2e270d] to-[#050200] shadow-[0px_0px_24px_#FFA500] text-white">
      <div className="absolute inset-0">
        <div className="rounded-lg border border-white/20 absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
        <div className="rounded-lg border absolute inset-0 border-white/40 [mask-image:linear-gradient(top,black,transparent)]"></div>
        <div className="absolute inset-0 shadow-[0_0_10px_rgb(255,165,0,.7)_inset] rounded-lg"></div>
      </div>
      <span>{props.children}</span>
    </button>
  );
};

export default WaitlistButton;
