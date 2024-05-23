import { create } from "zustand";

const useSettingsMenu = create((set) => ({
  open: true,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));

export default useSettingsMenu;
