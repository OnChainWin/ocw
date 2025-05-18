import Link from "next/link";
import React from "react";
import { FaDiscord, FaInstagram, FaMediumM, FaTelegram } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import Image from "next/image";
import { FiMail } from "react-icons/fi";
import Messages from "./Messages";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div>
      <footer className="border-t border-black dark:border-white/10 shadow-md">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="container mx-auto items-center flex flex-col justify-center text-center">
          <div className="xl:grid xl:grid-cols-2">
            <div className="space-y-8 mt-6 ">
              <Image
                src="/logo.png"
                width={120}
                height={120}
                alt="logo"
                className="hover:scale-110 transition-all ease-in-out hover:duration-300 cursor-pointer items-center text-center justify-center max-md:mx-auto"
              />
              <p className="text-sm sm:text-left leading-6 ">
                Our special smart contract collects funds and automatically
                distributes prizes to lucky winner or winners without allowing
                any admin touch or manipulation.
              </p>
              <div className="flex space-x-6 max-md:items-center max-md:justify-center">
                <Link
                  href="https://x.com/onchainwinx"
                  target="_blank"
                  className="hover:scale-110 ease-in-out hover:duration-300">
                  <RiTwitterXLine className="w-6 h-6" />
                </Link>
                <Link
                  href="https://medium.com/@onchainwin"
                  target="_blank"
                  className="hover:scale-110 ease-in-out hover:duration-300">
                  <FaMediumM className="w-6 h-6" />
                </Link>
                <Link
                  href="https://discord.gg/SufJnfDkN6"
                  target="_blank"
                  className="hover:scale-110 ease-in-out hover:duration-300">
                  <FaDiscord className="w-6 h-6" />
                </Link>
                <Link
                  href="https://www.instagram.com/onchainwin/"
                  target="_blank"
                  className="hover:scale-110 ease-in-out hover:duration-300">
                  <FaInstagram className="w-6 h-6" />
                </Link>
                <Link
                  href="https://t.me/onchainwin"
                  target="_blank"
                  className="hover:scale-110 ease-in-out hover:duration-300">
                  <FaTelegram className="w-6 h-6" />
                </Link>
                <Link
                  href="mailto:support@onchainwin.com"
                  target="_blank"
                  className="hover:scale-110 ease-in-out hover:duration-300">
                  <FiMail className="w-6 h-6" />
                </Link>
              </div>
            </div>
            <div className="flex justify-center text-center items-center mt-20">
              <Messages />
            </div>
          </div>
          <div className="mt-16 mb-1 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 text-center">
            <p className="text-sm text-muted-foreground leading-5">
              &copy; {new Date().getFullYear()} OnChain Win. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
