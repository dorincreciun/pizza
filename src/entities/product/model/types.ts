import type { PizzaCrust, PizzaSize, VariantType } from "@prisma/client";

import type { IngredientModel } from "@entities/ingredient/@x/product";

export interface ProductVariantModel {
    id: string;
    price: string;
    priceInCents: number;
    variantType: VariantType;
    size: PizzaSize | null;
    crust: PizzaCrust | null;
}

/** Modelul de domeniu pentru detaliul unui produs. */
export interface ProductModel {
    id: string;
    imageUrl: string;
    name: string;
    price: string;
    description: string;
    short_description: string;
    ingredients: IngredientModel[];
    variants: ProductVariantModel[];
}

/** Forma minima pentru carduri in catalog (listare). */
export interface ProductListItem {
    id: string;
    imageUrl: string;
    name: string;
    price: string;
    short_description: string;
    defaultVariantId: string;
    unitPriceInCents: number;
}

/** Meta pagina pentru paginare. */
export interface ProductsPageMeta {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
}

/** Raspunsul pentru o pagina de produse. */
export interface ProductsPageResult {
    products: ProductListItem[];
    meta: ProductsPageMeta;
}

/** Optiune generica pentru filtre UI. */
export interface FilterOption {
    id: string;
    name: string;
}

/** Setul de optiuni de filtrare pentru produse. */
export interface ProductFilterOptions {
    ingredients: FilterOption[];
    sizes: FilterOption[];
    crusts: FilterOption[];
}

/** Optiune pentru SegmentedControl / select (valoare enum + eticheta tradusa). */
export interface ProductOption<T extends string = string> {
    value: T;
    label: string;
}

/** Ingredient optional (addon) pentru pagina de detaliu. */
export interface ProductAddonModel {
    id: string;
    name: string;
    imageUrl: string;
    extraPrice: string;
    extraPriceInCents: number;
}

/** Model pentru pagina de detaliu — optiuni deja extrase pe server. */
export interface ProductDetailModel {
    id: string;
    imageUrl: string;
    name: string;
    price: string;
    description: string;
    short_description: string;
    sizes: ProductOption<PizzaSize>[];
    crusts: ProductOption<PizzaCrust>[];
    addons: ProductAddonModel[];
    variants: ProductVariantModel[];
}
