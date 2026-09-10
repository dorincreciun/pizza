import Image from "next/image";

import type { ProductDetailModel } from "@entities/product";
import { AddToCartPanel } from "@features/add-to-cart";
import { Container } from "@shared/ui";

interface ProductDetailProps {
    product: ProductDetailModel;
}

/**
 * Widget: layout-ul paginii de detaliu produs (doar prezentare).
 * Datele (sizes, crusts, addons) vin deja pregatite din `getProduct`.
 */
export function ProductDetail({ product }: ProductDetailProps) {
    return (
        <Container className="py-6 sm:py-10 lg:py-14">
            <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 md:grid-cols-12 lg:gap-12 xl:gap-16">
                <div className="md:sticky top-28 col-span-1 md:col-span-5">
                    <div className="relative aspect-square overflow-hidden rounded-3xl border border-orange-50/50 bg-linear-to-b from-[#FFF7EE] to-[#FFF0E0] shadow-sm transition-transform duration-500 hover:scale-[1.02] sm:rounded-4xl">
                        <Image
                            className="size-full object-contain p-6 drop-shadow-2xl sm:p-10 md:p-12"
                            src={product.imageUrl}
                            alt={product.name}
                            width={500}
                            height={500}
                        />
                    </div>
                </div>

                <div className="col-span-1 flex min-h-full flex-col md:col-span-7">
                    <AddToCartPanel product={product} />
                </div>
            </div>
        </Container>
    );
}
