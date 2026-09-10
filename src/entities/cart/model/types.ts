export interface CartItem {
    variantId: string;
    productId: string;
    name: string;
    imageUrl: string;
    variantLabel?: string;
    unitPriceInCents: number;
    quantity: number;
    extraIngredientIds?: string[];
}

export type AddCartItemInput = Omit<CartItem, "quantity"> & {
    quantity?: number;
};

export interface CartStoreProps {
    open: boolean;
    items: CartItem[];

    toggle: () => void;
    setOpen: (open: boolean) => void;
    addItem: (item: AddCartItemInput) => void;
    updateQuantity: (lineKey: string, quantity: number) => void;
    removeItem: (lineKey: string) => void;
    clearItems: () => void;
}
