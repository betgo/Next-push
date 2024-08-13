"use client";
import { useEffect, useState } from "react";

/**
 * Hook to return a value that's refreshed when the notification permission changes
 */
export const useNotificationPermissionListener = (query: () => boolean) => {
  const [result, setResult] = useState(query());

  useEffect(() => {
    const handler = () => {
      setResult(query());
    };

    if ("permissions" in navigator) {
      void navigator.permissions
        .query({ name: "notifications" })
        .then((permission) => {
          permission.addEventListener("change", handler);

          return () => {
            permission.removeEventListener("change", handler);
          };
        });
    }
  }, []);

  return result;
};
