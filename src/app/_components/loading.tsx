import { Spinner } from "@nextui-org/react";
import React from "react";

const Loading = ({ isLoading = 0 }: { isLoading: number }) => {
  return (
    <>
      {isLoading ? (
        <div className="">
          <Spinner className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform" />
        </div>
      ) : null}
    </>
  );
};

export default Loading;
