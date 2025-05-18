import React from "react";

type Props = {};

const Updates = (props: Props) => {
  return (
    <div className="dark:bg-[#fdffec] bg-[#2b2b2b] dark:text-black text-white">
      <span className="relative flex justify-center mt-5">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75" />
        <span className="text-3xl font-bold relative inline-block bg-transparent z-10 px-6"></span>
      </span>
      <div className="flex md:flex-row flex-col md:gap-5 justify-center items-center text-center">
        <div className="border-x-2 border-dotted p-8 ">
          <h2 className="text-3xl font-bold">Updates</h2>
          <ul className="space-y-2 border-t-2">
            <li className="flex items-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center h-8 text-sm hover:underline">
                v0.1.0
              </a>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between space-x-4">
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group dark:border-gray-300">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-violet-600"
                    />
                    <span className="group-hover:underline">
                      Smart Contracts
                    </span>
                  </a>
                  <span className="text-xs whitespace-nowrap">1st release</span>
                </div>
                <div className="-ml-12">
                  <p>We published our smarts contract.</p>
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center h-8 text-sm hover:underline ml-1">
                v0.1.1
              </a>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between space-x-4 ">
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group dark:border-gray-300">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-violet-600"
                    />
                    <span className="group-hover:underline">Update</span>
                  </a>
                  <span className="text-xs whitespace-nowrap">05.04.2024</span>
                </div>
                <div className="-ml-12">
                  <p>Front-End Updates</p>
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center h-8 text-sm hover:underline">
                v0.1.2
              </a>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between space-x-4 ">
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group dark:border-gray-300">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-violet-600"
                    />
                    <span className="group-hover:underline">Update</span>
                  </a>
                  <span className="text-xs whitespace-nowrap">08.04.2024</span>
                </div>
                <div className="-ml-12">
                  <p>Further updates</p>
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center h-8 text-sm hover:underline">
                v0.1.3
              </a>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between space-x-4 ">
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group dark:border-gray-300">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-violet-600"
                    />
                    <span className="group-hover:underline">Chain Update</span>
                  </a>
                  <span className="text-xs whitespace-nowrap">16.04.2024</span>
                </div>
                <div className="-ml-12">
                  <p>Scroll Sepolia Update</p>
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center h-8 text-sm hover:underline">
                v0.1.4
              </a>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between space-x-4 ">
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group dark:border-gray-300 ">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-violet-600"
                    />
                    <span className="group-hover:underline">
                      New Contracts{" "}
                    </span>
                  </a>
                  <span className="text-xs whitespace-nowrap">01.05.2024</span>
                </div>
                <div className="-ml-12">
                  <p>Contract Update</p>
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center h-8 text-sm hover:underline">
                v0.2.0
              </a>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between space-x-4 ">
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group dark:border-gray-300 ">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-violet-600"
                    />
                    <span className="group-hover:underline">
                      Version Update
                    </span>
                  </a>
                  <span className="text-xs whitespace-nowrap">11.05.2024</span>
                </div>
                <div className="-ml-12">
                  <p>We published our new website.</p>
                </div>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center h-8 text-sm hover:underline">
                v0.2.1
              </a>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between space-x-4 ">
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group dark:border-gray-300 ">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-violet-600"
                    />
                    <span className="group-hover:underline">
                      Important Updates
                    </span>
                  </a>
                  <span className="text-xs whitespace-nowrap">16.10.2024</span>
                </div>
                <div className="-ml-12">
                  <p>Backend & Core Updates</p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className=" border-2 rounded-sm dark:bg-[#f5f5f5] bg-[#1f1f1f] border-dotted p-8 ">
          <h2 className="text-3xl font-bold border-b-2 rounded-full">
            Next Release(s)
          </h2>
          <ul className="space-y-6 ">
            <li className="flex items-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center h-8 text-sm hover:underline">
                v0.3.0
              </a>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between space-x-4">
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="inline-flex items-center px-3 py-1 my-1 space-x-2 text-sm border rounded-full group dark:border-gray-300 bg-lime-500  animate-pulse repeat-infinite duration-1000">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-black animate-pulse repeat-infinite duration-1000"
                    />
                    <span className="group-hover:underline">
                      SCR || Animation Update
                    </span>
                  </a>
                  <span className="text-xs font-light whitespace-nowrap">
                    Under Development
                  </span>
                </div>
                <div>
                  <p>Currently, we are developing our websites and more.</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Updates;
