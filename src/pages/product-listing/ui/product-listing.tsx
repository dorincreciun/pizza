import { getTranslations } from "next-intl/server";

import { ProductFilter } from "@features/products-filter";
import { Container } from "@shared/ui/container";
import { Title } from "@shared/ui/title";
import { Categories } from "@widgets/categories";
import { ProductsList } from "@widgets/products";

interface ProductListingPageProps {
    categoryId?: string;
    page?: number;
    sizes?: string[];
    crusts?: string[];
    ingredients?: string[];
}

export async function ProductListingPage({
    categoryId,
    page,
    sizes,
    crusts,
    ingredients,
}: ProductListingPageProps) {
    const t = await getTranslations("pages.HomePage");

    return (
        <Container className="py-6 sm:py-8 lg:py-12">
            <Title as="h2" size="xl" className="mb-5 sm:mb-6 lg:mb-8">
                {t("title")}
            </Title>
            <div className="flex items-center justify-between">
                <Categories />
            </div>
            <div className="flex flex-col gap-6 pt-6 sm:gap-8 sm:pt-8 lg:flex-row lg:items-stretch lg:gap-10 lg:pt-10 xl:gap-12">
                <div className="w-full shrink-0 lg:w-auto">
                    <ProductFilter />
                </div>
                <ProductsList
                    categoryId={categoryId}
                    page={page}
                    sizes={sizes}
                    crusts={crusts}
                    ingredients={ingredients}
                />
            </div>
        </Container>
    );
}
