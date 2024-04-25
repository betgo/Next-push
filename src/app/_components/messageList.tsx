import React, { Fragment } from "react";
import Message from "./message";
import dayjs from "dayjs";
import { useMessageStore } from "~/store/messageStore";
import { type EnhancedMessage } from "~/shared/type";

type MessageList = {
  data: EnhancedMessage[];
  id: string | number;
};

const MessageList = ({ data = [], id }: MessageList) => {
  let curTime: Date | null = null;
  const storeMessageIds = useMessageStore((state) => state.storeMessageIds);

  return (
    <div className="flex flex-col-reverse" key={id}>
      {data.map((d) => {
        const node = [];
        if (!d) return null;
        if (dayjs(d.createdAt).isBefore(dayjs().startOf("day")) && curTime) {
          curTime = null;
          node.push(
            <div
              className="tody relative text-center text-muted-foreground"
              key={curTime}
            >
              <span className=" relative z-10 bg-background px-1">今天</span>
            </div>,
          );
        } else if (dayjs(d.createdAt).isAfter(dayjs().startOf("day"))) {
          curTime = d.createdAt;
        }
        node.push(
          <Fragment key={d.id}>
            <Message msg={d} isLocal={storeMessageIds.includes(d.id)} />
          </Fragment>,
        );
        return node;
      })}
    </div>
  );
};

export default MessageList;
