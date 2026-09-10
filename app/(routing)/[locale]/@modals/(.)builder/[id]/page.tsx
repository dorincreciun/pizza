import {ProductModal} from "@widgets/product-modal";
import {getProduct} from "@entities/product";

interface BuilderPageProps {
    params: Promise<{id: string}>
}

export default async function BuilderModal({params}: BuilderPageProps) {
    const {id} = await params;
    const product = await getProduct({id})

    if (!product) return null

    return <ProductModal product={product}/>
}
