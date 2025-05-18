"use client";

import DeletePost from "@/components/DeletePost";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import React, { Fragment } from "react";
import { useAccount } from "wagmi";

interface EditDeleteProps {
  slug: string;
}

const EditDelete: React.FC<EditDeleteProps> = ({ slug }) => {
  const { address } = useAccount();
  const authorizedAddress = "0x0C81eAb0896b32AAB44175872462cC4126AaB0F7";

  return (
    <Fragment>
      {address === authorizedAddress && (
        <div className="flex gap-2">
          <Link href={`/blog/${slug}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <DeletePost slug={slug} />
        </div>
      )}
    </Fragment>
  );
};

export default EditDelete;
