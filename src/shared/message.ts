import { type Message } from "@prisma/client";
import { generateRandomId } from "./Utils/uuid";
import { MESSAGETYPE } from "./constant";
import {
  type TextMessage,
  type EnhancedMessage,
  type infiniteMessages,
  type ImageMessage,
  type FileMessage,
} from "./type";
import { produce } from "immer";
import { type InfiniteData } from "@tanstack/react-query";

// 构造新的消息
export const createMessage = (m: TextMessage | ImageMessage | FileMessage) => {
  const uuid = generateRandomId();
  const msg: EnhancedMessage = {
    createdAt: new Date(),
    id: uuid,
    message: "",
    updatedAt: new Date(),
    type: "TEXT",
    ua: 0,
    url: null,
    fileName: null,
    fileSize: null,
    isDel: 0,
    isFetching: true,
  };
  switch (m.type) {
    case MESSAGETYPE.TEXT:
      msg.type = MESSAGETYPE.TEXT;
      msg.message = m.text;
      break;
    case MESSAGETYPE.FILE:
      msg.type = MESSAGETYPE.FILE;
      msg.fileName = m.fileName;
      msg.fileSize = m.fileSize;
      break;
    case MESSAGETYPE.IMAGE:
      msg.type = MESSAGETYPE.IMAGE;
      msg.url = m.url;
      break;
  }
  return { message: msg, id: uuid };
};
/**
 * 替换InfiniteData中指定id的消息。
 *
 * @param oldData 原始的InfiniteData对象，包含无限滚动的消息数据。
 * @param key 需要被替换的消息的id。
 * @param data 用于替换原有消息的新消息数据。
 * @returns 返回一个新的InfiniteData对象，其中指定id的消息已被替换。
 */
export const Replace_InfiniteData_Id = (
  oldData: InfiniteData<infiniteMessages, string | null>,
  key: string,
  data: Message,
) => {
  /**
   * 如果是newpage = produce(oldData.page)
   * oldData.page =newpage
   * 会导致oldData.page无法再改变
   * TypeError: Cannot add property 26, object is not extensible
   */
  const newoldData = produce(oldData, (draftPages) => {
    draftPages.pages.forEach((draftPage) => {
      draftPage.items.forEach((item, index) => {
        if (item.id === key) {
          draftPage.items[index] = data;
        }
      });
    });
  });
  return newoldData;
};

/**
 * 将新数据插入到无限数据集的末尾。
 *
 * @param oldData 原始无限数据集，如果为空则初始化数据集。
 * @param data 需要插入的新数据项。
 * @returns 更新后的无限数据集。
 */
export const Insert_InfiniteData = (
  oldData: InfiniteData<infiniteMessages, string | null> | undefined,
  data: Message,
) => {
  if (!oldData) {
    // 如果原始数据为空，初始化数据集
    return {
      pages: [{ items: [data], nextCursor: null }],
      pageParams: [],
    };
  }
  // 在现有数据的最后一页添加新数据项
  oldData.pages[0]?.items.unshift(data);
  return oldData;
};
