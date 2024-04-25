import { type InfiniteData } from "@tanstack/react-query";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { deepClone } from "~/shared/Utils/clone";
import { type infiniteMessages } from "~/shared/type";

export type Updater<T> = (updater: (value: T) => void) => void;

interface MessageState {
  storeMessageIds: string[];
  storeMessage: InfiniteData<infiniteMessages, string | null | undefined>;
  addMessage: (id: string) => void;
  updateMessages: <T extends Partial<MessageState>>(message: T) => void;
  update: Updater<MessageState>;
}

export const useMessageStore = create(
  persist<MessageState>(
    (set, get) => ({
      storeMessageIds: [],
      storeMessage: { pageParams: [], pages: [] },
      addMessage: (id: string) =>
        set((state) => ({
          storeMessageIds: state.storeMessageIds.concat(id).slice(-300),
        })),
      updateMessages: (message) => set(() => ({ ...message })),
      update(updater) {
        const state = deepClone(get()) as MessageState;
        updater(state);
        set(state);
      },
    }),
    {
      name: "message-storage", // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
