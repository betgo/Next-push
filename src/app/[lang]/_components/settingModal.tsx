"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { ReactElement, useState } from "react";
import EyeSlashFilledIcon from "~/assets/icons/EyeSlashFilled.svg";
import EyeFilledIcon from "~/assets/icons/EyeFilled.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useConfigStore } from "~/store/configStore";
import { type IGlobalConfig } from "~/shared/type";
import { ShortKeys } from "~/shared/constant";
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import { useDictStore } from "~/store/dicStore";

type SettingModal = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose?: () => void;
  onRefresh?: () => void;
};

const SettingModal = ({
  isOpen,
  onOpenChange,
  onClose,
  onRefresh,
}: SettingModal): JSX.Element => {
  const { lang } = useParams();
  const pathname = usePathname().replace(`/${lang as string}`, "");
  const { dict } = useDictStore();

  const { config, setConfig } = useConfigStore((state) => state);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const { register, getValues, control } = useForm<IGlobalConfig>({
    defaultValues: config,
  });

  const onLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    localStorage.setItem("lang", value);

    // void router.replace(`/${value}${pathname}`);
    window.location.href = `/${value}${pathname}`;
  };
  console.log("[lang]: ", lang);

  const handleSubmit = () => {
    setConfig(getValues());
    onRefresh?.();
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <form>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {dict?.setting.text}
              </ModalHeader>
              <ModalBody>
                <div className="rounded-xl border border-border shadow">
                  <RowList text={dict?.setting.password.text || "password"}>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                          variant="bordered"
                          labelPlacement="outside-left"
                          placeholder={
                            dict?.setting.password.placeholder || "password"
                          }
                          endContent={
                            <button
                              className="focus:outline-none"
                              type="button"
                              onClick={toggleVisibility}
                            >
                              {isVisible ? (
                                <EyeSlashFilledIcon className=" pointer-events-none text-lg text-default-400" />
                              ) : (
                                <EyeFilledIcon className=" pointer-events-none text-lg text-default-400" />
                              )}
                            </button>
                          }
                          type={isVisible ? "text" : "password"}
                          className="justify-between"
                          onBlur={onBlur}
                          onChange={onChange}
                          value={value}
                        />
                      )}
                    />
                  </RowList>
                  <RowList
                    text={dict?.setting.sendShortKey.text || "sendShortKey"}
                  >
                    <Controller
                      control={control}
                      name="sendShortKey"
                      render={({ field }) => (
                        <Select
                          variant="bordered"
                          aria-label="发送键"
                          selectedKeys={[field.value]}
                          {...field}
                        >
                          {ShortKeys.map((item) => (
                            <SelectItem key={item.key}>{item.label}</SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  </RowList>
                  <RowList text={dict?.setting.language.text || "language"}>
                    <Select
                      variant="bordered"
                      aria-label="lang"
                      onChange={onLangChange}
                      selectedKeys={[lang as string]}
                    >
                      <SelectItem key="cn">中文</SelectItem>
                      <SelectItem key="en">English</SelectItem>
                    </Select>
                  </RowList>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  {dict?.button.cancel}
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  {dict?.button.ok}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </form>
    </Modal>
  );
};

const RowList = ({
  text,
  children,
}: {
  text: string;
  children: ReactElement;
}) => {
  return (
    <div className="min-h-10 flex items-center justify-between border-b border-b-border px-4 py-2 last:border-none">
      <div className="">{text}</div>
      <div className="w-[50%]">{children}</div>
    </div>
  );
};

export default SettingModal;
