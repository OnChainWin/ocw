"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { useSearchParams, usePathname } from "next/navigation";
import { getReferralCode } from "@/lib/utils";

const VerifyEmailArea = () => {
  const [isOpen, setIsOpen] = useState(false);
  const account = useAccount();
  const pathname = usePathname();

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (pathname !== "/" && account?.address) {
        try {
          const response = await fetch(
            `/api/userverifstatus?wallet=${encodeURIComponent(
              account.address
            )}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();

          if (!data.durum) {
            setIsOpen(true);
          }
        } catch (error) {
          console.error("Error checking email verification status:", error);
        }
      }
    };

    checkEmailVerification();
  }, [account?.address, pathname]);

  return (
    <div className="flex flex-col ">
      <VerifyEmail isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const VerifyEmail = ({ isOpen, setIsOpen }: any) => {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get("ref");
  const storedRef = getReferralCode();

  const account = useAccount();
  const [email, setEmail] = useState<any>("");
  const [emailverificationtoken, setEmailverificationtoken] = useState<any>("");
  const [usedrefcode, setReferrralVerificationToken] = useState<any>("");

  useEffect(() => {
    const refCode = urlRef || storedRef;
    if (refCode && usedrefcode !== refCode) {
      setReferrralVerificationToken(refCode);
    }
  }, [urlRef, storedRef, usedrefcode]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessageSend, setSuccessMessageSend] = useState("");
  const [errorMessageSend, setErrorMessageSend] = useState("");

  const timerRef = useRef<number | null>(null);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/verify/checkcode", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          emailverificationtoken,
        }),
      });

      const { durum, error } = await response.json();

      if (!durum) {
        setErrorMessageSend(error);
        return;
      }

      setSuccessMessage("Verified successfully");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Email did not send. Please try again.");
    } finally {
      setEmailverificationtoken("");
    }
  };

  const requestVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setErrorMessageSend("Please enter your email address.");
      return;
    }

    if (account?.address === undefined) {
      setErrorMessageSend("Please connect your wallet first.");
      return;
    }

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          wallet: account?.address,
          email,
          usedrefcode,
        }),
      });

      const { durum, error } = await response.json();

      if (!durum) {
        setErrorMessageSend(error);
        return;
      }

      setSuccessMessageSend("Verification email sent successfully");
    } catch (error) {
      console.error(error);
      setErrorMessageSend("Email did not send. Please try again.");
    } finally {
      setEmailverificationtoken("");
    }
  };

  useEffect(() => {
    if (
      successMessage ||
      errorMessage ||
      successMessageSend ||
      errorMessageSend
    ) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        setSuccessMessageSend("");
        setErrorMessageSend("");
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [successMessage, errorMessage, successMessageSend, errorMessageSend]);

  function truncateAddress(address: string) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer items-center text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-black to-[#2b2b2b] text-white py-10 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <button
              className="absolute z-0 top-2 right-2 bg-white/20 p-1 rounded-full hover:scale-105 hover:ease-linear hover:duration-300"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="text-white text-[200px] " />
            </button>
            <div className="relative z-6">
              <div className="w-16 h-16 grid place-items-center mx-auto">
                <Image
                  src="/logo.png"
                  width={50}
                  height={50}
                  alt="logo"
                  className="hover:scale-110 transition-all duration-500"
                />
              </div>
              <div>
                <div className="relative overflow-hidden z-10 sm:p-6 rounded-xl ">
                  <h2 className="text-2xl font-bold mb-6">
                    Email Verification Area
                  </h2>
                  <div className="text-sm flex flex-col">
                    Wallet Address
                    <span className="text-lime-300 sm:text-md text-xs">
                      {account?.address}
                    </span>
                  </div>

                  <div className="my-4">
                    <label className="block text-sm font-medium ">
                      Email Address
                    </label>
                    <input
                      className="mt-1 p-2 w-full  border border-gray-600 rounded-md text-gray-200"
                      name="email"
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email address"
                    />
                  </div>
                  <div className="my-5">
                    <label className="block text-sm font-medium">
                      Referral Code
                    </label>
                    <input
                      className="mt-1 p-2 w-full border border-gray-600 rounded-md text-gray-200"
                      value={usedrefcode}
                      onChange={(e) =>
                        setReferrralVerificationToken(e.target.value)
                      }
                      required
                      disabled
                      placeholder="Your referral"
                    />
                  </div>

                  <form onSubmit={requestVerification}>
                    <div className="flex justify-end">
                      <button
                        className="bg-black hover:bg-neutral-700 text-white px-4 py-2 font-bold rounded-md hover:opacity-80 transition duration-300 w-full"
                        type="submit"
                      >
                        Request Verification Token
                      </button>
                    </div>

                    {successMessageSend && (
                      <div className="p-4 my-3  rounded-xl text-center items-center font-bold text-white border">
                        {successMessageSend}
                      </div>
                    )}
                    {errorMessageSend && (
                      <div className="text-red-500">{errorMessageSend}</div>
                    )}
                  </form>

                  <form onSubmit={sendEmail}>
                    <div className="my-4">
                      <label className="block text-sm font-medium">
                        Verification Token
                      </label>
                      <input
                        className="mt-1 p-2 w-full border border-gray-600 rounded-md text-gray-200"
                        type="text"
                        value={emailverificationtoken}
                        onChange={(e) =>
                          setEmailverificationtoken(e.target.value)
                        }
                        required
                        placeholder="Your verification token"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="bg-gradient-to-r from-orange-600 via-orange-400 to-orange-500 text-white px-4 py-2 font-bold rounded-md hover:opacity-80 transition duration-300 w-full"
                        type="submit"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                  {successMessage && (
                    <div className="p-4 mt-3 border rounded-xl font-bold text-orange-500">
                      {successMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="text-red-500">{errorMessage}</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerifyEmailArea;
