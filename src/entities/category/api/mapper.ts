import type { CategoryModel, CategoryRow } from "../model/types";

export function mapCategory(category: CategoryRow): CategoryModel {
    return {
        id: category.id,
        name: category.translations[0]?.name ?? "",
    };
}
