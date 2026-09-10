import { getFilterOptions } from "@entities/product";

import { ProductFilterResponsive } from "./product-filter-responsive";

export async function ProductFilter() {
    const options = await getFilterOptions();

    return <ProductFilterResponsive options={options} />;
}
