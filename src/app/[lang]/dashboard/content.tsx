"use client";
import React, { useEffect } from "react";
import ScrollAnchoringComponent from "../_components/ScrollAnchoringComponent";
import clsx from "clsx";
import { trpc } from "~/trpc/react";
import { useConfigStore } from "~/store/configStore";
import MessageList from "../_components/messageList";
import { type Dictionary } from "~/dictionaries";
import NetworkDetector from "../_components/network";
import Chat from "../_components/Chat";
import { useDictStore } from "~/store/dicStore";
import { useNotificationConnect } from "~/hooks/useNotificationConnect";
import { useMessageStore } from "~/store/messageStore";

const Content = ({ dict }: { dict: Dictionary }) => {
  const configStore = useConfigStore.getState();
  const storeMessageIds = useMessageStore((state) => state.storeMessageIds);
  useEffect(() => {
    useDictStore.getState().update(dict);
  }, []);

  const messages = trpc.message.infiniteMessages.useInfiniteQuery(
    {},
    {
      // 修改 api
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: (query) => {
        // 如果有错误发生，则返回 false 来停止自动重新获取
        if (query.state.error) return false;
        if (!configStore.isAuth) return false;
        // 否则，可以设置一个固定的重新获取间隔，例如 5000 毫秒
        return process.env.NODE_ENV === "development" ? 1000 * 60 * 5 : 10000;
      },
      // staleTime: 5 * 1000,
      retry: 0,
      maxPages: 20,
    },
  );
  useNotificationConnect(messages.data, storeMessageIds);

  const handleScroll = (scrollTop: number) => {
    if (scrollTop < 200 && !messages.isFetching && messages.hasNextPage) {
      void messages.fetchNextPage();
    }
  };
  
  return (
    <>
      <NetworkDetector />
      <ScrollAnchoringComponent onScroll={handleScroll}>
        <div
          className={clsx(
            "h-6 text-center",
            messages.isFetching ? "opacity-100" : "opacity-0",
          )}
        >
          Loading...
        </div>
        {messages.data?.pages
          .map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              <MessageList
                data={page.items ?? []}
                id={page.nextCursor ?? "1"}
              />
            </React.Fragment>
          ))
          .reverse()}
      </ScrollAnchoringComponent>
      <Chat />
    </>
  );
};

export default Content;
