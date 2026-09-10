import type { Prisma } from "@prisma/client";

import type { IngredientModel } from "../model/types";

/** Forma randului de Prisma pentru un ingredient cu traduceri. Strict intern slice-ului. */
export type IngredientRow = Prisma.IngredientGetPayload<{
    include: {
        translations: true;
    };
}>;

export function mapIngredient(ingredient: IngredientRow): IngredientModel {
    const translation = ingredient.translations?.[0];

    return {
        id: ingredient.id,
        name: translation?.name ?? "",
        imageUrl: ingredient.imageUrl ?? "",
    };
}
