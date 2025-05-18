import Image from "next/image";
import Link from "next/link";
import React from "react";

const Nav = () => {
  return (
    <header className="container mx-auto bg-transparent">
      <div className="flex items-center lg:justify-between justify-center py-5">
        <div className="flex flex-shrink-0 items-center">
          <Link href={"/"}>
            <Image src="/logo.png" alt="logo" width={56} height={56} />
          </Link>
        </div>
        <ul
          id="nav-default"
          className="mt-4 lg:flex h-screen maxh-0 w-full flex-col items-start text-sm opacity-0 md:mt-0 md:h-auto md:max-h-screen md:w-auto md:flex-row md:space-x-1 md:border-0 md:opacity-100">
          <li>
            <Link
              href={"/#about"}
              className="block px-4 py-2 no-underline outline-none hover:no-underline uppercase">
              <div className="text-sm transition-colors duration-300 hover:text-orange-500">
                About
              </div>
            </Link>
          </li>

          <li>
            <Link
              href={"/#blog"}
              className="block px-4 py-2 no-underline outline-none hover:no-underline uppercase">
              <div className="text-sm transition-colors duration-300 hover:text-orange-500">
                Blog
              </div>
            </Link>
          </li>

          <li>
            <Link
              href={"/#rules"}
              className="block px-4 py-2 no-underline outline-none hover:no-underline uppercase">
              <div className="text-sm transition-colors duration-300 hover:text-orange-500">
                Rules
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Nav;
