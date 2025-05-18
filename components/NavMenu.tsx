"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useChainId } from "wagmi";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const chainId = useChainId();
  const isBase = chainId === 8453;
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen)
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 hover:text-gray-400 hover:scale-125 hover:ease-linear hover:duration-300 ">
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
    );

  return (
    <div>
      <div className="relative z-40 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </div>

      <div className="fixed overflow-y-scroll overscroll-y-none inset-0 z-40 flex rounded-3xl">
        <div className="w-4/5">
          <div className="relative flex w-full max-w-md flex-col overflow-y-auto dark:bg-[#2b2b2b] bg-[#F9FAF2] pb-12 shadow-xl rounded-br-3xl">
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="justify-end text-end flex relative -m-2  items-center rounded-md p-2 text-gray-400 bg-black hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-2 ml-4">
              <Link href={"/"}>
                <Image
                  src="/logo.png"
                  alt="OnChain Win"
                  width={69}
                  height={69}
                  className="hover:cursor-pointer hover:scale-110 ease-in-out transition-all duration-500"
                />
              </Link>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-4">
              <div className="flow-root">
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/ocw"
                  className="-m-2 block p-2 font-medium hover:cursor-pointer hover:text-lime-500">
                  Raffle 1
                </Link>
              </div>
              <div className="flow-root">
                <Link
                  onClick={() => setIsOpen(false)}
                  href={"/freeocw"}
                  className="-m-2 block p-2 font-medium hover:cursor-pointer hover:text-lime-500 ">
                  Raffle 2
                </Link>
              </div>

              {/* <div className="flow-root">
                <Link
                  onClick={() => setIsOpen(false)}
                  href={"/freeocw3"}
                  className="-m-2 block p-2 font-medium hover:cursor-pointer hover:text-lime-500 ">
                  Raffle 3
                </Link>
              </div> */}

              <div className="flow-root">
                <Link
                  onClick={() => setIsOpen(false)}
                  href={"/tokenocw"}
                  className="-m-2 block p-2 font-medium hover:cursor-pointer hover:text-lime-500 ">
                  Raffle 3
                </Link>
              </div>

              <div className="flow-root">
                <Link
                  onClick={() => setIsOpen(false)}
                  href={isBase ? "/partnership" : "/varonve"}
                  className="-m-2 block p-2 font-medium hover:cursor-pointer hover:text-lime-500 ">
                  Partnership Raffle
                </Link>
              </div>

              <div className="flow-root">
                <Link
                  onClick={() => setIsOpen(false)}
                  href={isBase ? "/partnershipocw" : "/monsters"}
                  className="-m-2 block p-2 font-medium hover:cursor-pointer hover:text-lime-500 ">
                  Partnership Raffle [2]
                </Link>
              </div>

              <div className="flow-root">
                <Link
                  onClick={() => setIsOpen(false)}
                  href={"/raffleguide"}
                  className="-m-2 block text-lime-400 p-2 font-medium hover:cursor-pointer hover:text-lime-500 ">
                  Raffle Guide
                </Link>
              </div>
              {/* <div className="flow-root">
                <Link
                  onClick={() => setIsOpen(false)}
                  href="/demo"
                  className="-m-2 block p-2 font-medium hover:cursor-pointer hover:text-lime-500 ">
                  Demo 🎫
                </Link>
              </div> */}
              <div className="grid grid-cols-6 md:space-x-2 md:flex md:justify-center lg:justify-start max-sm:grid-cols-3 gap-1">
                <a
                  aria-label="add to discord"
                  target="_blank"
                  href="https://discord.gg/SufJnfDkN6"
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-full duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-600/20 dark:hover:border-cyan-300/30">
                  <div className="flex justify-center space-x-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      className="w-6 h-6"
                      viewBox="0 0 256 256">
                      <g fill="none">
                        <rect
                          width={256}
                          height={256}
                          fill="#5865f2"
                          rx={60}></rect>
                        <g clipPath="url(#skillIconsDiscord0)">
                          <path
                            fill="#fff"
                            d="M197.308 64.797a164.918 164.918 0 0 0-40.709-12.627a.618.618 0 0 0-.654.31c-1.758 3.126-3.706 7.206-5.069 10.412c-15.373-2.302-30.666-2.302-45.723 0c-1.364-3.278-3.382-7.286-5.148-10.412a.643.643 0 0 0-.655-.31a164.472 164.472 0 0 0-40.709 12.627a.583.583 0 0 0-.268.23c-25.928 38.736-33.03 76.52-29.546 113.836a.685.685 0 0 0 .26.468c17.106 12.563 33.677 20.19 49.94 25.245a.648.648 0 0 0 .702-.23c3.847-5.254 7.276-10.793 10.217-16.618a.633.633 0 0 0-.347-.881c-5.44-2.064-10.619-4.579-15.601-7.436a.642.642 0 0 1-.063-1.064a86.364 86.364 0 0 0 3.098-2.428a.618.618 0 0 1 .646-.088c32.732 14.944 68.167 14.944 100.512 0a.617.617 0 0 1 .655.08a79.613 79.613 0 0 0 3.106 2.436a.642.642 0 0 1-.055 1.064a102.622 102.622 0 0 1-15.609 7.428a.638.638 0 0 0-.339.889a133.075 133.075 0 0 0 10.208 16.61a.636.636 0 0 0 .702.238c16.342-5.055 32.913-12.682 50.02-25.245a.646.646 0 0 0 .26-.46c4.17-43.141-6.985-80.616-29.571-113.836a.506.506 0 0 0-.26-.238M94.834 156.142c-9.855 0-17.975-9.047-17.975-20.158s7.963-20.158 17.975-20.158c10.09 0 18.131 9.127 17.973 20.158c0 11.111-7.962 20.158-17.973 20.158m66.456 0c-9.855 0-17.974-9.047-17.974-20.158s7.962-20.158 17.974-20.158c10.09 0 18.131 9.127 17.974 20.158c0 11.111-7.884 20.158-17.974 20.158"></path>
                        </g>
                        <defs>
                          <clipPath id="skillIconsDiscord0">
                            <path fill="#fff" d="M28 51h200v154.93H28z"></path>
                          </clipPath>
                        </defs>
                      </g>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="add to twitter"
                  target="_blank"
                  href="https://x.com/onchainwinx"
                  className="p-4 border border-gray-200   dark:border-gray-700 rounded-full duration-300 hover:border-green-400 hover:shadow-lg hover:shadow-lime-600/20 dark:hover:border-green-300/30">
                  <div className="flex justify-center space-x-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      className="w-6 h-6"
                      height="1em"
                      viewBox="0 0 512 512">
                      <path
                        fill="currentColor"
                        d="M389.2 48h70.6L305.6 224.2L487 464H345L233.7 318.6L106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z"></path>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="add to medium"
                  target="_blank"
                  href="https://medium.com/@onchainwin"
                  className="p-4 border border-gray-200  dark:border-gray-700 rounded-full duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/20 dark:hover:border-blue-300/30">
                  <div className="flex justify-center space-x-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      className="w-6 h-6"
                      viewBox="0 0 32 32">
                      <path
                        fill="currentColor"
                        d="M4.469 8.894a1.179 1.179 0 0 0-.381-.988l-2.819-3.4V4h8.762l6.775 14.856L22.762 4h8.356v.506l-2.412 2.313a.704.704 0 0 0-.269.675v17a.704.704 0 0 0 .269.675l2.356 2.313v.506H19.206v-.506l2.444-2.369c.238-.238.238-.313.238-.675V10.7l-6.794 17.244h-.919L6.275 10.7v11.556c-.069.487.094.975.438 1.325l3.175 3.85v.506h-9v-.5l3.175-3.856c.337-.35.494-.844.406-1.325z"></path>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="add to instagram"
                  target="_blank"
                  href="https://www.instagram.com/onchainwin/"
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-full duration-300 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-600/20 dark:hover:border-indigo-300/30">
                  <div className="flex justify-center space-x-4">
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="100"
                      height="100"
                      viewBox="0 0 48 48">
                      <radialGradient
                        id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
                        cx="19.38"
                        cy="42.035"
                        r="44.899"
                        gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#fd5"></stop>
                        <stop offset=".328" stopColor="#ff543f"></stop>
                        <stop offset=".348" stopColor="#fc5245"></stop>
                        <stop offset=".504" stopColor="#e64771"></stop>
                        <stop offset=".643" stopColor="#d53e91"></stop>
                        <stop offset=".761" stopColor="#cc39a4"></stop>
                        <stop offset=".841" stopColor="#c837ab"></stop>
                      </radialGradient>
                      <path
                        fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                        d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path>
                      <radialGradient
                        id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
                        cx="11.786"
                        cy="5.54"
                        r="29.813"
                        gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                        gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#4168c9"></stop>
                        <stop
                          offset=".999"
                          stopColor="#4168c9"
                          stopOpacity="0"></stop>
                      </radialGradient>
                      <path
                        fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                        d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"></path>
                      <path
                        fill="#fff"
                        d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"></path>
                      <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
                      <path
                        fill="#fff"
                        d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"></path>
                    </svg>
                  </div>
                </a>

                <a
                  aria-label="add to telegram"
                  target="_blank"
                  href="https://t.me/onchainwin"
                  className="p-4 border border-gray-200   dark:border-gray-700 rounded-full duration-300 hover:border-indigo-400 hover:shadow-lg hover:shadow-slate-600/20 dark:hover:border-slate-300/30">
                  <div className="flex justify-center space-x-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      x="0px"
                      y="0px"
                      width="100"
                      height="100"
                      viewBox="0 0 48 48">
                      <path
                        fill="#29b6f6"
                        d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"></path>
                      <path
                        fill="#fff"
                        d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"></path>
                      <path
                        fill="#b0bec5"
                        d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"></path>
                      <path
                        fill="#cfd8dc"
                        d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"></path>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="mail to support"
                  href="mailto:support@onchainwin.com"
                  className="p-4 border border-gray-200  dark:border-gray-700 rounded-full duration-300 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-600/20 dark:hover:border-orange-300/30">
                  <div className="flex justify-center space-x-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.33em"
                      className="h-6 w-6"
                      height="1em"
                      viewBox="0 0 256 193">
                      <path
                        fill="#4285f4"
                        d="M58.182 192.05V93.14L27.507 65.077L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"></path>
                      <path
                        fill="#34a853"
                        d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837l-27.026 25.798z"></path>
                      <path
                        fill="#ea4335"
                        d="m58.182 93.14l-4.174-38.647l4.174-36.989L128 69.868l69.818-52.364l4.669 34.992l-4.669 40.644L128 145.504z"></path>
                      <path
                        fill="#fbbc04"
                        d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"></path>
                      <path
                        fill="#c5221f"
                        d="m0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"></path>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
