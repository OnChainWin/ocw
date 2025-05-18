import Image from "next/image";
import React from "react";

const SupportSection = () => {
  return (
    <section className="relative z-50 border-t my-12 lg:my-24 border-black dark:border-white container">
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-volet-500 to-transparent w-full"></div>
        </div>
      </div>

      <div className="sticky top-10 ">
        <div className="text-orange-500 text-[24px] mt-24 flex justify-center uppercase tracking-widest">
          ▶︎ SUPPORTED BY ◀︎
        </div>
        <div className="flex justify-center flex-col items-center my-12">
          <p className="text-2xl font-bold mb-5">Scroll Randomness</p>
          <Image
            src={"/scrollrandom.png"}
            alt="Scroll"
            height={200}
            width={200}
            className="rounded-xl size-36 object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
