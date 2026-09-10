import { getTranslations, setRequestLocale } from "next-intl/server";

import { readFiltersFromQuery } from "@features/products-filter";
import { normalizeCategoryId } from "@features/toggle-category";
import { ProductListingPage } from "@pages/product-listing";

interface HomePageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{
        categoryId?: string;
        page?: string;
        sizes?: string;
        crusts?: string;
        ingredients?: string;
    }>;
}

export default async function HomePage({
    params,
    searchParams,
}: HomePageProps) {
    const { locale } = await params;
    const { categoryId, page, sizes, crusts, ingredients } =
        await searchParams;
    const filters = readFiltersFromQuery({ sizes, crusts, ingredients });

    setRequestLocale(locale);

    await getTranslations("pages.HomePage");

    return (
        <ProductListingPage
            categoryId={normalizeCategoryId(categoryId)}
            page={page ? Number(page) : undefined}
            sizes={filters.sizes.length > 0 ? filters.sizes : undefined}
            crusts={filters.crusts.length > 0 ? filters.crusts : undefined}
            ingredients={
                filters.ingredients.length > 0 ? filters.ingredients : undefined
            }
        />
    );
}