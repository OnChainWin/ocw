"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import Switch from "./switch";
import MobileNav from "./NavMenu";
import { cn } from "@/utils/cn";
import { useAccount } from "wagmi";
import RequestETH from "./RequestETH";
import MobileNavMenu from "./MobileNav";

type Props = {};

const Navbar = (props: Props) => {
  const account = useAccount();
  return (
    <div className="flex justify-between w-full shadow-md dark:border-white/[0.2] dark:bg-black bg-white  pr-2 pl-8 py-2 items-center space-x-4">
      <div className="flex flex-row items-center justify-center gap-10">
        {/* <MobileNav /> */}
        <MobileNavMenu />
        <Link
          href={"/"}
          className="flex gap-2 hover:scale-110 ease-in-out hover:duration-300 transition-all">
          <Image src="/logo.png" width={50} height={50} alt="logo" />
        </Link>
      </div>
      <div className="relative gap-10 right-3 ml-11 flex-row flex">
        <Switch />
        <ConnectButton />
      </div>
    </div>
  );
};
export default Navbar;

export const NavbarMain = (props: Props) => {
  const account = useAccount();
  return (
    <div className="flex justify-between w-full shadow-md dark:border-white/[0.2] dark:bg-black bg-white  pr-2 pl-8 py-2 items-center space-x-4">
      <div className="flex flex-row items-center justify-center gap-10">
        {/* <MobileNav /> */}
        <MobileNavMenu />
        <Link
          href={"/"}
          className="flex gap-2 hover:scale-110 ease-in-out hover:duration-300 transition-all">
          <Image src="/logo.png" width={50} height={50} alt="logo" />
        </Link>
      </div>
      <div className="relative gap-10 right-3 ml-11 flex-row flex">
        <Switch />
        <Link className="px-6 py-2 rounded-xl font-medium text-base bg-black shadow-[0px_0px_12px_#FF9A23] text-white transition-transform duration-300 ease-in-out hover:bg-neutral-900 hover:scale-105" href={"/play"}>Raffle Area</Link>
        {/* <ConnectButton /> */}
      </div>
    </div>
  );
}
