"use server";

import { getTranslations } from "next-intl/server";

import { getCategoryList } from "@entities/category";
import { ALL_CATEGORY_ID } from "@features/toggle-category";

import { CategoriesDisplay } from "./categories-display";

export async function Categories() {
    const t = await getTranslations("widgets.categories");
    const dbCategories = await getCategoryList();

    const categories = [
        { id: ALL_CATEGORY_ID, name: t("all") },
        ...dbCategories,
    ];

    return <CategoriesDisplay categories={categories} />;
}
