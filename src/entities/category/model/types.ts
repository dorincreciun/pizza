import type { Prisma, UserLanguage } from "@prisma/client";

/** Modelul de domeniu pentru o categorie (forma folosita in UI). */
export interface CategoryModel {
    id: string;
    name: string;
}

/** Forma randului Prisma cu traduceri. Strict intern slice-ului. */
export type CategoryRow = Prisma.CategoryGetPayload<{
    select: {
        id: true;
        translations: {
            where: { locale: UserLanguage };
            select: { name: true };
        };
    };
}>;
