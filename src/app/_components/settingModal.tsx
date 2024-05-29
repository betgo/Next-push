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
  const { config, setConfig } = useConfigStore((state) => state);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const { register, getValues, control } = useForm<IGlobalConfig>({
    defaultValues: config,
  });

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
              <ModalHeader className="flex flex-col gap-1">设置</ModalHeader>
              <ModalBody>
                <div className="rounded-xl border border-border shadow">
                  <RowList text="密码">
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                          variant="bordered"
                          labelPlacement="outside-left"
                          placeholder="请输入访问密码"
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
                  <RowList text="发送键">
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  确定
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
