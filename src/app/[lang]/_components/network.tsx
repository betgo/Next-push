"use client";
import React, { useEffect, useState } from "react";
import { useDictStore } from "~/store/dicStore";
let windowOnline = true;
if (typeof window !== "undefined") {
  windowOnline = window.navigator.onLine;
}

const NetworkDetector = () => {
  const { dict } = useDictStore();
  const [isOnline, setIsOnline] = useState(windowOnline);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 清理监听器
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div className="absolute w-full bg-red-600 text-center">
          <p>{dict?.network}</p>
        </div>
      )}
    </>
  );
};

export default NetworkDetector;
