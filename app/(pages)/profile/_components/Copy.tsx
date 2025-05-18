"use client";
import { Copy, CopyCheck } from "lucide-react";
import React from "react";

export const CopyToClipboardPage = ({ textToCopy }: { textToCopy: string }) => {
  const { copied, onCopy } = useClipboard(textToCopy, { duration: 4000 });

  return (
    <div className="flex items-center justify-center p-2">
      <button className="focus:outline-none text-sm" onClick={onCopy}>
        {copied ? (
          <CopyCheck className="w-5 h-5 transition-all ease-in-out duration-500 text-orange-500 " />
        ) : (
          <Copy className="w-5 h-5 transition-all ease-in-out duration-500" />
        )}
      </button>

      {copied && (
        <span className="text-sm border text-orange-700 bg-orange-300 ml-2 rounded-xl px-2 transition-all ease-in-out duration-500">
          Copied!
        </span>
      )}
    </div>
  );
};

/* logic */
const useClipboard = (text: string, props: any) => {
  const [copied, setCopied] = React.useState(false);
  const resetCopy = React.useRef<NodeJS.Timeout | null>(null);

  const onCopy = React.useCallback(() => {
    navigator.clipboard.writeText(text).then(() => setCopied(true));
  }, [text]);

  React.useEffect(() => {
    if (copied) {
      resetCopy.current = setTimeout(
        () => setCopied(false),
        props?.duration || 3000,
      );
    }

    return () => {
      if (resetCopy.current) {
        clearTimeout(resetCopy.current);
      }
    };
  }, [copied, props.duration]);

  return { copied, onCopy };
};
