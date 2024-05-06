"use client";
import React, { useEffect } from "react";

import Loading from "../_components/loading";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";

import MessageList from "../_components/messageList";
import Chat from "../_components/Chat";
import useScrollToBottom from "~/hooks/useScrollToBottom";
import { trpc } from "~/trpc/react";
import { useMessageStore } from "~/store/messageStore";
import NetworkDetector from "../_components/network";
import { useConfigStore } from "~/store/configStore";
import clsx from "clsx";
import ScrollAnchoringComponent from "../_components/ScrollAnchoringComponent";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const query = useSearchParams();
  const configStore = useConfigStore.getState();
  const password = query.get("code");

  useEffect(() => {
    if (password) {
      configStore.setConfig({ password });
    }
  }, [configStore, password]);

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
        return 10000;
      },
      // staleTime: 5 * 1000,
      retry: 0,
      maxPages: 20,
    },
  );

  const handleScroll = (scrollTop: number) => {
    if (scrollTop < 200 && !messages.isFetching && messages.hasNextPage) {
      void messages.fetchNextPage();
    }
  };
  return (
    <>
      <div className="flex h-full w-full max-w-[1200px] sm:w-5/6 sm:min-w-[600px]">
        <div className=" relative flex w-full flex-col rounded-lg border border-border bg-background pb-4  shadow-lg sm:my-8">
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
        </div>
      </div>
      {/* <Loading isLoading={isFetching || isMutating} /> */}
    </>
  );
};

export default Page;
