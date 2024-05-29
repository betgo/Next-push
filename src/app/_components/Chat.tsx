import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import React, { useRef, useState } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineSend,
  AiOutlineSetting,
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
  const addMessage = useMessageStore((state) => state.addMessage);
  const configStore = useConfigStore.getState();

  const { theme, setTheme } = useTheme();
  const [textValue, setTextValue] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textSubmit = trpc.message.sendMessage.useMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        toast.success("上传成功");
      }
    },
    onError: (error) => {
      // Handle the error here
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
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large.");
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
      toast.success("刷新成功");
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

  return (
    <div className="mt-2 flex   flex-col border-t pb-4 pl-2 pr-2 pt-2 ">
      <div className="mb-2 space-x-2">
        <ChatBtn
          text="上传"
          icon={<AiOutlineCloudUpload />}
          onClick={() => {
            // 触发隐藏的文件输入元素的点击事件
            fileInputRef.current?.click();
          }}
        />
        <ChatBtn
          text={theme === "dark" ? "深色模式" : "亮色模式"}
          icon={theme === "dark" ? <CiDark /> : <CiLight />}
          onClick={() => {
            toggleColorMode();
          }}
        />
        <ChatBtn
          text="设置"
          icon={<AiOutlineSetting />}
          onClick={() => {
            onOpen();
          }}
        />
        <ChatBtn
          text="刷新"
          icon={
            <span className={clsx(refrechLoaing && "icon-spin")}>
              <LuRefreshCcw />
            </span>
          }
          onClick={() => {
            void onRefresh();
          }}
        />
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
        placeholder={"请输入"}
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
