import {ProductDetailPage} from "@pages/product-detail";
import {getProduct} from "@entities/product";
import {notFound} from "next/navigation";

interface ProductPageProps {
    params: Promise<{id: string}>
}

export default async function ProductPage({params}: ProductPageProps) {
    const {id} = await params;
    const product = await getProduct({id})

    if(!product) return notFound()

    return <ProductDetailPage product={product} />
}