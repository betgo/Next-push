import { create } from "zustand";
import { Dictionary } from "~/dictionaries";

interface DictState {
  dict: Dictionary | null;
  update: (data: Dictionary) => void;
}
export const useDictStore = create<DictState>((set) => ({
  dict: null,
  update: (data: Dictionary) => set({ dict: data }),
}));
