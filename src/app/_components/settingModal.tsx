import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import React, { useState } from "react";
import EyeSlashFilledIcon from "~/assets/icons/EyeSlashFilled.svg";
import EyeFilledIcon from "~/assets/icons/EyeFilled.svg";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useConfigStore } from "~/store/configStore";
import { IGlobalConfig } from "~/shared/type";

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
                  <div className="min-h-10 border-b border-b-border px-4 py-2 last:border-none">
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input
                          label="密码:"
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
                  </div>
                  {/* <div className="min-h-[40px] border-b border-b-border px-4 py-2 last:border-none"></div> */}
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

export default SettingModal;
