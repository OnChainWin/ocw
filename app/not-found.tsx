"use client";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen overflow-auto flex flex-col items-center justify-center  text-gray-800 dark:text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl md:text-3xl font-medium mb-6">
          Oops! Page not found
        </p>
        <p className="text-lg mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <p className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-md shadow-md hover:bg-gray-800 transition duration-300 ease-in-out">
              Go Home
            </p>
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <img src="/logo.png" alt="Not Found" className="w-64 h-64 mx-auto" />
      </div>
    </div>
  );
};

export default NotFoundPage;
