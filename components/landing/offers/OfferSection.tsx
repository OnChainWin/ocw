import Image from "next/image";
import React from "react";
import GlowCard from "../helper/glow-card";
import { BsBack, BsBasket } from "react-icons/bs";

export const offersData = [
  {
    id: 1,
    title: "Referral Program: Lifetime Passive Income",
    action: "Learn More",
    description:
      "OnChainWin referral program offers a LIFETIME commission for ALL paid transactions from referred customers. OnChainWin collects a 5% service fee from the ticket sales on its platform. With the new referral program, you can earn 10% of this service fee as a commission every time someone you refer buys a paid ticket. But here’s the real kicker: this is not just a one-time reward; you’ll continue to earn lifetime commissions on every ticket they purchase, as long as they remain active on the platform. To start, share your unique referral link with your friends, followers, or community. The referral link can be found on the profile.",
    icon: <BsBasket size={36} />,
  },
  {
    id: 2,
    title: "Airdrop Program: Participate and Receive Token Airdrop",
    action: "Learn More",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque dolore consectetur ratione quam ipsa quibusdam doloribus consequatur molestias assumenda debitis natus aspernatur laborum quaerat corrupti odio eligendi repellat sed ex aut, commodi doloremque et. Ipsum vero nobis fugit deleniti beatae, dolorem recusandae voluptate sunt! Obcaecati ea ullam distinctio magni itaque.",
    icon: <BsBasket size={36} />,
  },
  {
    id: 3,
    title: "Offer 3",
    action: "Learn More",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque dolore consectetur ratione quam ipsa quibusdam doloribus consequatur molestias assumenda debitis natus aspernatur laborum quaerat corrupti odio eligendi repellat sed ex aut, commodi doloremque et. Ipsum vero nobis fugit deleniti beatae, dolorem recusandae voluptate sunt! Obcaecati ea ullam distinctio magni itaque.",
    icon: <BsBasket size={36} />,
  },
  {
    id: 4,
    title: "Offer 4",
    action: "Learn More",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque dolore consectetur ratione quam ipsa quibusdam doloribus consequatur molestias assumenda debitis natus aspernatur laborum quaerat corrupti odio eligendi repellat sed ex aut, commodi doloremque et. Ipsum vero nobis fugit deleniti beatae, dolorem recusandae voluptate sunt! Obcaecati ea ullam distinctio magni itaque.",
    icon: <BsBack size={36} />,
  },
  {
    id: 5,
    title: "Offer 5",
    action: "Learn More",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque dolore consectetur ratione quam ipsa quibusdam doloribus consequatur molestias assumenda debitis natus aspernatur laborum quaerat corrupti odio eligendi repellat sed ex aut, commodi doloremque et. Ipsum vero nobis fugit deleniti beatae, dolorem recusandae voluptate sunt! Obcaecati ea ullam distinctio magni itaque.",
    icon: <BsBack size={36} />,
  },
  {
    id: 6,
    title: "Offer 6",
    action: "Learn More",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque dolore consectetur ratione quam ipsa quibusdam doloribus consequatur molestias assumenda debitis natus aspernatur laborum quaerat corrupti odio eligendi repellat sed ex aut, commodi doloremque et. Ipsum vero nobis fugit deleniti beatae, dolorem recusandae voluptate sunt! Obcaecati ea ullam distinctio magni itaque.",
    icon: <BsBack size={36} />,
  },
];

const OfferSection = () => {
  return (
    <section className="container relative z-50 border-t my-12 lg:my-24 border-black dark:border-white">
      <svg
        className="absolute -z-20 left-[max(50%,25rem)] top-0 h-[76rem] w-[128rem] -translate-x-1/2 stroke-gray-700 dark:stroke-gray-400 [mask-image:radial-gradient(64rem_64rem_at_bottom,white,transparent)] opacity-20"
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

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent w-full"></div>
        </div>
      </div>

      <div className="sticky top-10 ">
        <div className="text-orange-500 text-[24px] my-24 flex justify-center uppercase tracking-widest">
          <p className="text-3xl font-sans text-center">Our Offers</p>
        </div>
      </div>

      <div className="py-8 items-center text-center justify-center flex">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {offersData.map((offer) => (
            <GlowCard key={offer.id} identifier={`offer-${offer.id}`}>
              <div className="p-5 relative">
                <div className="gap-x-8 px-3 py-5">
                  <div className="text-orange-500 mb-5 transition-all duration-300 flex items-center justify-center">
                    {offer.icon}
                  </div>
                </div>

                <div>
                  <p className="text-xl mt-3 font-medium">
                    {offer.title}
                  </p>
                  <p className="text-md  leading-8 mt-3">
                    {offer.description}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm mt-3 text-orange-500 hover:text-orange-700 inline-block border border-orange-500 px-3 py-2 hover:bg-orange-100 rounded-lg">
                    {offer.action}
                  </p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
