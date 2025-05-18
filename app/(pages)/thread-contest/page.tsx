"use client";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import React, { Fragment, useState } from "react";
import Footer from "@/components/Footer";

type Props = {};

type FormValues = {
  walletAddress: string;
  name: string;
  email: string;
  details: string;
  socialChannels: {
    discord: string;
    telegram: string;
    x: string;
  };
};

const ThreadContestPage = (props: Props) => {
  const [formValues, setFormValues] = useState<FormValues>({
    walletAddress: "",
    name: "",
    email: "",
    details: "",
    socialChannels: {
      discord: "",
      telegram: "",
      x: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formValues.walletAddress.trim() ||
      !formValues.name.trim() ||
      !formValues.email.trim() ||
      !formValues.details.trim() ||
      !formValues.socialChannels.discord.trim() ||
      !formValues.socialChannels.telegram.trim() ||
      !formValues.socialChannels.x.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Submitting...",
      description: "Your application is being submitted.",
    });

    try {
      const response = await fetch("/api/thread-contest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      toast({
        title: "Success!",
        description:
          data.message || "Your application has been submitted successfully.",
        variant: "default",
      });

      setFormValues({
        walletAddress: "",
        name: "",
        email: "",
        details: "",
        socialChannels: {
          discord: "",
          telegram: "",
          x: "",
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Fragment>
      <div className="min-h-screen -mt-12 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full shadow-xl shadow-orange-500  space-y-8 p-8 rounded-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Thread Contest
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Share your thread and win a prize
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="walletAddress"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Wallet Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="walletAddress"
                  type="text"
                  required
                  value={formValues.walletAddress}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      walletAddress: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                  placeholder="0x0123"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Thread URL <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="details"
                  required
                  value={formValues.details}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      details: e.target.value,
                    }))
                  }
                  rows={1}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                  placeholder="Thread URL"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Social Channels <span className="text-red-500">*</span>
                </h3>

                <div>
                  <label
                    htmlFor="discord"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discord <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="discord"
                    type="text"
                    required
                    value={formValues.socialChannels.discord}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        socialChannels: {
                          ...prev.socialChannels,
                          discord: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                    placeholder="Discord username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="telegram"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telegram <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="telegram"
                    type="text"
                    required
                    value={formValues.socialChannels.telegram}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        socialChannels: {
                          ...prev.socialChannels,
                          telegram: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                    placeholder="Telegram username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="x"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    X (Twitter) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="x"
                    type="text"
                    required
                    value={formValues.socialChannels.x}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        socialChannels: {
                          ...prev.socialChannels,
                          x: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                    placeholder="X (Twitter) username"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                Submit Application
              </button>
            </div>
          </form>
        </div>
        <Toaster />
      </div>
      <Footer />
    </Fragment>
  );
};

export default ThreadContestPage;
