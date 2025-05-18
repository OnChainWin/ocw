import Image from "next/image";
import React from "react";

type Props = {};

const Roadmap = (props: Props) => {
  return (
    <div>
      <div className="flex justify-center">
        <Image
          className="justify-center md:flex items-center self-center md:w-auto hidden aspect-[3.13]"
          src={"/roadmapb.png"}
          alt="roadmap"
          width={3400}
          height={1080}
        />
        <Image
          className="justify-center flex items-center self-center md:hidden w-full"
          src={"/roadmap.png"}
          alt="roadmap"
          width={2000}
          height={1080}
        />
      </div>
    </div>
  );
};

export default Roadmap;
