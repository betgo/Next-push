import { type InfiniteData } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import notifier from "~/shared/Notifier";
import { type infiniteMessages } from "~/shared/type";

export const useNotificationConnect = (
  data: InfiniteData<infiniteMessages, string | null> | undefined,
  excludes: string[] = [],
) => {
  const [prevData, setPrevData] = useState(
    data?.pages[0]?.items[0] || undefined,
  );
  useEffect(() => {
    const newData = data?.pages[0]?.items[0];
    if (
      newData &&
      prevData &&
      newData.id !== prevData.id &&
      dayjs(newData.createdAt).isAfter(prevData.createdAt) &&
      !excludes.includes(newData.id)
    ) {
      console.log("notify");

      setPrevData(newData);
      void notifier.notify(newData.message || "message");
    } else if (prevData === undefined) {
      setPrevData(newData);
    }
  }, [data, excludes, prevData]);
};
