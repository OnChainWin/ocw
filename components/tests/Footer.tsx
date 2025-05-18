import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsInstagram, BsLinkedin, BsTwitterX } from "react-icons/bs";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="py-5 border-t border-white/15">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex gap-2 lg:flex-1 items-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
              className="h-7 w-auto cursor-pointer hover:scale-105 transition-all"
            />
            <div className="font-medium">Clodron Startup Landing Page</div>
          </div>
          <nav className="flex flex-col lg:flex-row lg:gap-7 gap-5 lg:justify-center">
            <Link
              href={"#"}
              className="text-white/70 hover:text-white text-xs md:text-sm transition ">
              Features
            </Link>
            <Link
              href={"#"}
              className="text-white/70 hover:text-white text-xs md:text-sm transition ">
              Developers
            </Link>
            <Link
              href={"#"}
              className="text-white/70 hover:text-white text-xs md:text-sm transition ">
              Company
            </Link>
            <Link
              href={"#"}
              className="text-white/70 hover:text-white text-xs md:text-sm transition ">
              Blog
            </Link>
            <Link
              href={"#"}
              className="text-white/70 hover:text-white text-xs md:text-sm transition ">
              Changelog
            </Link>
          </nav>
          <div className="flex gap-5 lg:flex-1 lg:justify-end">
            <BsTwitterX className="text-white/40 hover:text-white transition" />
            <BsInstagram className="text-white/40 hover:text-white transition" />
            <BsLinkedin className="text-white/40 hover:text-white transition" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
