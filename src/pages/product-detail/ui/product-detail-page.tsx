import type { ProductDetailModel } from "@entities/product";
import { ProductDetail } from "@widgets/product-detail";

interface ProductDetailPageProps {
    product: ProductDetailModel;
}

/** Pagina compune widget-ul; fara logica de domeniu. */
export function ProductDetailPage({ product }: ProductDetailPageProps) {
    return <ProductDetail product={product} />;
}
