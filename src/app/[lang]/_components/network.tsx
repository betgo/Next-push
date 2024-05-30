"use client";
import React, { useEffect, useState } from "react";
let windowOnline = true;
if (typeof window !== "undefined") {
  windowOnline = window.navigator.onLine;
}

const NetworkDetector = () => {
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
          <p>网络连接断开，请检查你的网络</p>
        </div>
      )}
    </>
  );
};

export default NetworkDetector;
