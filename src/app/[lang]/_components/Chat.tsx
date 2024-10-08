"use client";
import { Textarea, useDisclosure } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineSend,
  AiOutlineSetting,
  AiOutlineBell,
} from "react-icons/ai";
import { LuRefreshCcw } from "react-icons/lu";

import { CiDark, CiLight } from "react-icons/ci";
import ChatBtn from "./ChatBtn";
import { useMutation } from "@tanstack/react-query";
import useScrollToBottom from "~/hooks/useScrollToBottom";
import toast from "react-hot-toast";
import { useMessageStore } from "~/store/messageStore";
import { useTheme } from "next-themes";
import { trpc } from "~/trpc/react";
import SettingModal from "./settingModal";
import { useConfigStore } from "~/store/configStore";
import {
  Insert_InfiniteData,
  Replace_InfiniteData_Id,
  createMessage,
} from "~/shared/message";
import { MESSAGETYPE, SHORTKEY } from "~/shared/constant";
import clsx from "clsx";
import { type Message } from "@prisma/client";
import { useDictStore } from "~/store/dicStore";
import { env } from "~/env.mjs";
import notifier from "~/shared/Notifier";
import { useNotificationPermissionListener } from "~/hooks/useNotificationPermissionListener";

const uploadFile = async (file: File, oldId: string) => {
  const response = await fetch(
    `/api/upload?filename=${file.name}&filesize=${file.size}&key=${oldId}`,
    {
      method: "POST",
      body: file,
    },
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response;
};

const Chat = () => {
  const { dict } = useDictStore();
  const addMessage = useMessageStore((state) => state.addMessage);
  const configStore = useConfigStore.getState();

  const { theme, setTheme } = useTheme();
  const [textValue, setTextValue] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textSubmit = trpc.message.sendMessage.useMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const showNotificationPermissionRequired = useNotificationPermissionListener(
    () => notifier.notRequested(),
  );
  const [refrechLoaing, setRefrechLoaing] = useState(false);

  const { scrollRef, autoScroll } = useScrollToBottom("scroll");
  const utils = trpc.useUtils();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      let newMsg = createMessage({
        type: MESSAGETYPE.TEXT,
        text: "new",
      });
      // 判断文件是不是图片格式
      if (file.type.startsWith("image/")) {
        // 构造图片消息
        newMsg = createMessage({
          type: MESSAGETYPE.IMAGE,
          url: URL.createObjectURL(file),
        });
      } else {
        // 构造文件消息
        newMsg = createMessage({
          type: MESSAGETYPE.FILE,
          fileName: file.name,
          fileSize: file.size + "",
        });
      }
      console.log("newMsg", newMsg);

      void utils.message.infiniteMessages.setInfiniteData({}, (oldData) => {
        const newData = Insert_InfiniteData(oldData, newMsg.message);
        return newData;
      });
      addMessage(newMsg.id);

      return uploadFile(file, newMsg.id);
    },
    onSuccess: async (data) => {
      const { msg, key }: { msg: Message; key: string } = await data.json();
      addMessage(msg.id);

      // void utils.message.infiniteMessages.fetchInfinite({});
      utils.message.infiniteMessages.setInfiniteData({}, (oldData) => {
        if (oldData) {
          oldData = Replace_InfiniteData_Id(oldData, key, msg);
        }
        return oldData;
      });
      if (data) {
        toast.success(dict?.chat.uploadbtn.success || "upload success");
      }
    },
    onError: (error) => {
      // Handle the error here
      toast(dict?.chat.uploadbtn.fail || "upload fail");
      console.log(error);
    },
  });

  const handleSubmit = async () => {
    if (textValue === "") return;
    try {
      // 构造文字消息
      const newMsg = createMessage({ type: MESSAGETYPE.TEXT, text: textValue });

      setTextValue("");
      autoScroll.current = true;
      void utils.message.infiniteMessages.setInfiniteData({}, (oldData) => {
        const newData = Insert_InfiniteData(oldData, newMsg.message);
        return newData;
      });
      addMessage(newMsg.id);
      const msg = await textSubmit.mutateAsync({ message: textValue });
      addMessage(msg.id);

      utils.message.infiniteMessages.setInfiniteData({}, (oldData) => {
        if (oldData) {
          oldData = Replace_InfiniteData_Id(oldData, newMsg.id, msg);
        }
        return oldData;
      });
      if (!utils.message.infiniteMessages.getInfiniteData({})) {
        void utils.message.infiniteMessages.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onUpload = (file: File) => {
    if (file.size > env.NEXT_PUBLIC_BLOB_MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      toast.error(dict?.chat.uploadbtn.tooLarge || "File too large.");
      return;
    }

    if (!configStore.isAuth) {
      toast.error("error.");
      return;
    }
    autoScroll.current = true;
    mutation.mutate(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      onUpload?.(uploadedFile);
    }
    if (fileInputRef?.current?.value) {
      fileInputRef.current.value = "";
    }
  };
  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  // 重新获取数据
  const onRefresh = async () => {
    setRefrechLoaing(true);
    try {
      await utils.message.infiniteMessages.reset();
      toast.success(dict?.chat.refreshbtn.success || "refresh success");
      autoScroll.current = true;
    } catch (error) {
      console.log(error);
    }
    setRefrechLoaing(false);
  };
  // 发送快捷键
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
      if (configStore.config.sendShortKey === SHORTKEY.CTRL_ENTER) {
        if (e.key === "Enter" && e.ctrlKey) {
          e.preventDefault();
          void handleSubmit();
        }
      }
      return;
    }
    if (configStore.config.sendShortKey === SHORTKEY.ENTER) {
      if (e.key === "Enter") {
        e.preventDefault();
        void handleSubmit();
      }
    }
  };
  // 获取通知权限
  const requestPermission = async () => {
    await notifier.maybeRequestPermission();
  };

  return (
    <div className="mt-2 flex   flex-col border-t pb-4 pl-2 pr-2 pt-2 ">
      <div className="mb-2 space-x-2">
        <ChatBtn
          text={dict?.chat.uploadbtn.text || "upload"}
          icon={<AiOutlineCloudUpload />}
          onClick={() => {
            // 触发隐藏的文件输入元素的点击事件
            fileInputRef.current?.click();
          }}
        />
        <ChatBtn
          text={
            theme === "dark"
              ? dict?.theme.dark || "dark"
              : dict?.theme.light || "light"
          }
          icon={theme === "dark" ? <CiDark /> : <CiLight />}
          onClick={() => {
            toggleColorMode();
          }}
        />
        <ChatBtn
          text={dict?.chat.settingbtn.text || "setting"}
          icon={<AiOutlineSetting />}
          onClick={() => {
            onOpen();
          }}
        />
        <ChatBtn
          text={dict?.chat.refreshbtn.text || "refresh"}
          icon={
            <span className={clsx(refrechLoaing && "icon-spin")}>
              <LuRefreshCcw />
            </span>
          }
          onClick={() => {
            void onRefresh();
          }}
        />
        {showNotificationPermissionRequired && (
          <ChatBtn
            text={dict?.chat.notify.text || "notify"}
            icon={<AiOutlineBell />}
            title={dict?.chat.notify.tooltip}
            onClick={() => {
              void requestPermission();
            }}
          />
        )}
      </div>
      <input
        type="file"
        accept="*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      {isOpen && (
        <SettingModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          // onClose={onOpen}
          onRefresh={() => {
            void utils.message.infiniteMessages.reset();
            autoScroll.current = true;
          }}
        />
      )}
      <Textarea
        ref={textRef}
        value={textValue}
        onValueChange={setTextValue}
        placeholder={dict?.input.placeholder || "Send a message..."}
        className="input:py-1  flex-1"
        classNames={{
          inputWrapper: "group-data-[focus=true]:border-[#e7f8ff]",
        }}
        minRows={1}
        maxRows={3}
        fullWidth
        variant={"bordered"}
        radius="sm"
        onKeyDown={onKeyDown}
        endContent={
          <div className="cursor-pointer p-1" onClick={handleSubmit}>
            <AiOutlineSend className="text-xl" />
          </div>
        }
      />
    </div>
  );
};

export default Chat;
