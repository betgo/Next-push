import { create } from "zustand";
import { createJSONStorage, persist, devtools } from "zustand/middleware";
import { type IGlobalConfig } from "~/shared/type";
import { logger } from "./middleware";
import { SHORTKEY } from "~/shared/constant";

interface ConfigState {
  config: IGlobalConfig;
  isAuth: boolean;
  setConfig: (config: Partial<IGlobalConfig>) => void;
  setIsAuth: (b: boolean) => void;
}

export const useConfigStore = create<ConfigState>()(
  devtools(
    logger(
      persist(
        (set) => ({
          config: {
            password: "",
            sendShortKey: SHORTKEY.ENTER,
          },
          isAuth: false,
          setConfig: (config) =>
            set((state) => ({
              ...state,
              config: { ...state.config, ...config },
            })),
          setIsAuth: (s: boolean) => set((state) => ({ ...state, isAuth: s })),
        }),
        {
          name: "config-storage", // unique name
          storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
      ),
    ),
  ),
);
