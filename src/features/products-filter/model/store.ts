import { create } from "zustand/react";

import type { ProductFilterSidebarStoreProps } from "./types";

export const useStoreProductsFilter = create<ProductFilterSidebarStoreProps>((set) => ({
    open: false,
    setOpen: (open) => set({ open }),
    toggle: () => set((state) => ({ open: !state.open })),
}));
