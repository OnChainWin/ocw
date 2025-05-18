import Image from "next/image";
import Link from "next/link";
import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import WaitlistButton from "./custom/WaitlistButton";

type Props = {};

const Nav = (props: Props) => {
  return (
    <nav className="sticky top-0 z-10 py-4 border-b border-white/15 md:border-none backdrop-blur md:backdrop-blur-none">
      <div className="container">
        <div className="flex justify-between items-center md:border border-white/15 p-2.5 rounded-xl max-w-3xl mx-auto md:backdrop-blur">
          <div>
            <div className="border h-12 w-12 rounded-lg inline-flex justify-center items-center border-white/15">
              <Image src="/logo.png" alt="logo" width={35} height={35} className="cursor-pointer hover:scale-105 transition-all" />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex gap-8 text-sm ">
              <Link
                className="text-white/70 hover:text-white transition"
                href="#">
                Features
              </Link>
              <Link
                className="text-white/70 hover:text-white transition"
                href="#">
                Developers
              </Link>
              <Link
                className="text-white/70 hover:text-white transition"
                href="#">
                Pricing
              </Link>
              <Link
                className="text-white/70 hover:text-white transition"
                href="#">
                Changelog
              </Link>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <WaitlistButton>Join waitlist</WaitlistButton>
            <RxHamburgerMenu className="w-7 h-7 md:hidden" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
