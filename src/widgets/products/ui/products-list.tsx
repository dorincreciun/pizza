import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Eye, Zap } from "lucide-react";

import { getProducts, ProductCard } from "@entities/product";
import { AddToCartCatalogButton } from "@features/add-to-cart";
import { APP_ROUTES } from "@shared/config";
import { cn } from "@shared/utils";
import { Pagination } from "@widgets/pagination";

interface ProductsListProps {
    categoryId?: string;
    page?: number;
    sizes?: string[];
    crusts?: string[];
    ingredients?: string[];
}

export const ProductsList = async ({
    categoryId,
    page,
    sizes,
    crusts,
    ingredients,
}: ProductsListProps) => {
    const t = await getTranslations("widgets.products");

    const { products, meta } = await getProducts({
        categoryId,
        page,
        sizes,
        crusts,
        ingredients,
    });

    return (
        <div className="flex min-w-0 flex-1 flex-col">
            <div
                className={cn(
                    "grid w-full min-w-0 grid-cols-1 gap-5",
                    "sm:grid-cols-2 sm:gap-6",
                    "lg:gap-7",
                    "xl:grid-cols-3 xl:gap-8",
                )}
            >
                {products.map((product) => (
                    <ProductCard key={product.id}>
                        <ProductCard.Media>
                            <ProductCard.MediaActions>
                                <ProductCard.MediaActionLink
                                    href={{
                                        pathname: APP_ROUTES.PRODUCT,
                                        params: { id: product.id },
                                    }}
                                >
                                    <Eye size={14} aria-hidden />
                                    {t("viewInPage")}
                                </ProductCard.MediaActionLink>
                                <ProductCard.MediaActionLink
                                    href={{
                                        pathname: APP_ROUTES.BUILDER,
                                        params: { id: product.id },
                                    }}
                                >
                                    <Zap size={14} aria-hidden />
                                    {t("fastOrder")}
                                </ProductCard.MediaActionLink>
                            </ProductCard.MediaActions>
                            <Image
                                src={product.imageUrl || ""}
                                alt=""
                                width={200}
                                height={200}
                                className="mx-auto h-auto w-full max-h-44 max-w-48 object-contain sm:max-h-48 sm:max-w-52 lg:max-h-52 lg:max-w-none"
                            />
                        </ProductCard.Media>

                        <ProductCard.Content>
                            <ProductCard.Title>
                                {product.name}
                            </ProductCard.Title>
                            <ProductCard.Description>
                                {product.short_description}
                            </ProductCard.Description>
                        </ProductCard.Content>

                        <ProductCard.Footer>
                            <span>{product.price}</span>
                            <AddToCartCatalogButton product={product} />
                        </ProductCard.Footer>
                    </ProductCard>
                ))}
            </div>
            <div className="mt-8 flex w-full min-w-0 justify-center sm:mt-10 lg:justify-start">
                <Suspense fallback={null}>
                    <Pagination totalPages={meta.totalPages} />
                </Suspense>
            </div>
        </div>
    );
};
