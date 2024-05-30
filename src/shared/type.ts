import { type Message } from "@prisma/client";
import { InfiniteData } from "@tanstack/react-query";
import { type RouterOutputs } from "~/trpc/shared";
import { type SHORTKEY, type MESSAGETYPE } from "./constant";

export interface IGlobalConfig {
  password: string;
  sendShortKey: SHORTKEY;
}

export type EnhancedMessage = Message & {
  isFetching?: boolean;
};

// 无限分页type
export type infiniteMessages = RouterOutputs["message"]["infiniteMessages"];

export type TextMessage = {
  type: MESSAGETYPE.TEXT;
  text: string;
};
export type ImageMessage = {
  type: MESSAGETYPE.IMAGE;
  url: string;
};
export type FileMessage = {
  type: MESSAGETYPE.FILE;
  fileName: string;
  fileSize: string;
};
