import Image from "next/image";
import React from "react";
import ContractCard from "./ContractCard";

export const offeringsData = [
  {
    id: 1,
    name: "Referral Program: Lifetime Passive Income",
    description: `
      OnChainWin collects a 5% service fee from the ticket sales on its platform.
      With the new referral program, you can earn 10% of this service fee as a commission every time someone you refer buys a paid ticket.
      But here’s the real kicker: this is not just a one-time reward; you’ll continue to earn lifetime commissions on every ticket they purchase, as long as they remain active on the platform.
    `,
    description2: `To start, share your unique referral link with your friends, followers, or community. The referral link can be found on the profile.`,
    explanation:
      "OnChainWin referral program offers a LIFETIME commission for ALL paid transactions from referred customers.",
    link: "/profile",
  },

  {
    id: 2,
    name: "Ambassador and KOL Program",
    description:
      "If you’re a content creator, developer, or blockchain enthusiast with a voice, this is your chance to help us grow while getting rewarded for your contributions.",
    description2:
      "Partners will be the direct part of the OnChainWin token airdrop and can participate in special events, rewards and giveaways like thread contests, product reviews, internal raffles etc.",
    explanation:
      "OnChainWin is seeking talented, influential partners to represent OnChainWin in the broader Web3 community.",
    link: "/be-an-ambassador",
  },
  {
    id: 3,
    name: "Airdrop Program: Participate and Receive Token Airdrop",
    description:
      "By participating in the raffles, completing tasks, and contributing to the project, you’ll earn OnChainWin tokens.",
    description2: `Users - Participate the raffles
    
 Core Team - Join us

Ambassadors and KOLs - Be a partner`,
    explanation:
      "OnChainWin’s Airdrop Program is designed to reward various participants in our ecosystem, from loyal users of the platform to strategic contributors who are helping us shape the future of decentralized entertainment.",
    link: "/profile",
  },
];

const OfferingsSection = () => {
  return (
    <section className="relative z-50 border-t my-12 lg:my-24 border-black dark:border-white container">
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-volet-500 to-transparent w-full"></div>
        </div>
      </div>

      <div className="sticky top-10 ">
        <div className="text-orange-500 text-[24px] my-24 flex justify-center uppercase tracking-widest">
          ▶︎ Offerings ◀︎
        </div>
      </div>

      <div className="pt-12">
        <div className="flex flex-col gap-6">
          {offeringsData.slice(0, 3).map((contract, index) => (
            <div
              className="sticky-card w-full mx-auto"
              key={contract.id}
              id={`sticky-card-${index + 1}`}>
              <ContractCard contract={contract} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;
