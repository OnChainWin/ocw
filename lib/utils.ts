import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Referral code utilities
export const REFERRAL_CODE_KEY = "ocw_referral_code";

export const saveReferralCode = (code: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFERRAL_CODE_KEY, code);
  }
};

export const getReferralCode = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFERRAL_CODE_KEY);
  }
  return null;
};
