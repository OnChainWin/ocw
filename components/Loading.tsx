import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="relative">
        <div className="w-20 h-20 border-orange-200 border-2 rounded-full"></div>
        <div className="w-20 h-20 border-orange-500 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
      </div>
    </div>
  );
};

export default Loading;
