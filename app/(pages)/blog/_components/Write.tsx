"use client";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";

export default function Write() {
  const account = useAccount();
  return (
    <div>
      {account.address == "0x0C81eAb0896b32AAB44175872462cC4126AaB0F7" && (
        <Link href="/write">
          <Button>
            <PenLine className="mr-2 h-4 w-4" />
            Write Post
          </Button>
        </Link>
      )}
    </div>
  );
}
