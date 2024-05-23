import { create } from "zustand";

const useEditMenu = create((set) => ({
  open: true,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));

export default useEditMenu;
