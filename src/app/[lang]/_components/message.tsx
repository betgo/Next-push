"use client";

import {
  AiOutlineDelete,
  AiOutlineCopy,
  AiOutlineDownload,
} from "react-icons/ai";
import Mobile from "~/assets/icons/mobile.svg";
import Computer from "~/assets/icons/computer.svg";
import File from "~/assets/icons/file.svg";
import toast from "react-hot-toast";
import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { copyImage, copyText, formatFileSize } from "../../shared";
import ZoomImage from "./zoomImage";
import ChatBtn from "./ChatBtn";

import { produce } from "immer";
import { trpc } from "~/trpc/react";
import { type EnhancedMessage } from "~/shared/type";
import TextEnhance from "./textEnhance";
import { useParams } from "next/navigation";
import { Locale } from "~/dictionaries";
import { useDictStore } from "~/store/dicStore";

dayjs.locale("zh-cn");

const Message = ({
  msg,
  onDelete,
  isLocal = false,
}: {
  msg: EnhancedMessage;
  onDelete?: (id: string) => void;
  isLocal: boolean; // 是否是本地消息
}) => {
  const { dict } = useDictStore();
  const utils = trpc.useUtils();
  const mutation = trpc.message.deleteMessage.useMutation({
    onSuccess: (data, variables, context) => {
      utils.message.infiniteMessages.setInfiniteData({}, (oldData) => {
        if (!oldData) {
          return {
            pages: [],
            pageParams: [],
          };
        }

        return produce(oldData, (draft) => {
          draft.pages = oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter(
              (item: { id: string }) => item.id !== data.id,
            ),
          }));
        });
      });
      toast.success(
        (dict?.message.deletebtn.success as string) || "Delete success.",
      );
    },
  });

  // 复制到剪切板
  const handleCopy = async () => {
    try {
      if (msg.type === "TEXT") {
        await copyText(msg.message ?? "");
      } else if (msg.type === "IMAGE") {
        await copyImage(msg.url ?? "");
      }
      toast.success(
        (dict?.message.copybtn.success as string) || "Copy success.",
      );
    } catch (error) {
      toast.error((dict?.message.copybtn.fail as string) || "Copy failed.");
    }
  };
  const messageRender = () => {
    if (msg.type === "IMAGE") {
      return (
        <ZoomImage
          src={msg.url!}
          alt="image"
          width={200}
          height={150}
          // fill={true}
          sizes="100vw"
          style={{
            width: "auto",
            height: "100%",
          }}
        />
      );
    } else if (msg.type === "FILE") {
      return (
        <div className=" flex rounded-md bg-input p-2 ">
          <div className="h-12 w-16 dark:text-black">
            <File className=" w-12" />
          </div>
          <div className="flex-1 break-all pr-2">
            <p className="line-clamp-2">{msg.fileName}</p>
            <p className="text-sm text-gray-400">
              {formatFileSize(Number(msg.fileSize) || 0)}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className=" whitespace-break-spaces  break-all text-base">
          <TextEnhance text={msg.message ?? ""} />
        </div>
      );
    }
  };

  const onDownload = () => {
    if (msg.type === "FILE") {
      const link = document.createElement("a");
      link.href = msg.url!;
      link.download = msg.fileName ?? "downFile";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 删除消息
  const deleteMessage = () => {
    mutation.mutate({
      id: msg.id,
    });
  };

  const timeAgo = dayjs(msg.createdAt).format("YYYY-MM-DD HH:mm:ss");

  return (
    <div className={`flex ${isLocal ? "flex-row-reverse" : "justify-start"} `}>
      <div
        className={`flex px-4 py-1 ${
          isLocal ? "flex-row-reverse" : "justify-start"
        }`}
      >
        <div className="mx-1 pt-8">
          {msg.ua === 0 ? (
            <Computer className="g-icon " />
          ) : (
            <Mobile className="g-icon " />
          )}
        </div>
        <div className="group/item flex max-w-[90%] flex-col">
          <div className="mb-1 space-x-1 opacity-0 transition-all group-hover/item:opacity-100">
            <ChatBtn
              text={dict?.message.copybtn.text || "Copy"}
              icon={<AiOutlineCopy />}
              onClick={() => {
                void handleCopy();
              }}
            />
            <ChatBtn
              text={dict?.message.deletebtn.text || "Delete"}
              icon={<AiOutlineDelete />}
              onClick={() => {
                deleteMessage();
              }}
            />
            {msg.type === "FILE" && (
              <ChatBtn
                text={dict?.message.downloadbtn.text || "Download"}
                icon={<AiOutlineDownload />}
                onClick={() => {
                  onDownload();
                }}
              />
            )}
          </div>
          <div className="min-w-[150px]  rounded-md border  bg-card p-4 ">
            <div className="text-xs text-gray-400">{timeAgo}</div>
            {messageRender()}
          </div>
        </div>
        {msg.isFetching && (
          <div className="flex items-end">
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
