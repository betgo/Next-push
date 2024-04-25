import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IGlobalConfig } from "~/shared/type";

interface ConfigState {
  config: IGlobalConfig;
  isAuth: boolean;
  setConfig: (config: IGlobalConfig) => void;
  setIsAuth: (b: boolean) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: {
        password: "",
      },
      isAuth: false,
      setConfig: (config) => set((state) => ({ ...state, config })),
      setIsAuth: (s: boolean) => set((state) => ({ ...state, isAuth: s })),
    }),
    {
      name: "config-storage", // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
