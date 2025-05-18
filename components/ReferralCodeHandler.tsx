"use client";

import { useEffect } from "react";
import { saveReferralCode } from "@/lib/utils";

export function ReferralCodeHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode) {
      saveReferralCode(refCode);
    }
  }, []);

  return null; // Bu component görsel bir şey render etmiyor
}
