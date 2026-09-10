import type { PizzaCrust, PizzaSize } from "@prisma/client";

import type { ProductAddonModel, ProductOption } from "@entities/product";
import { IngredientSelect } from "@features/product-addons";
import { Button, SegmentedControl } from "@shared/ui";
import { cn } from "@shared/utils";

interface ProductCustomizationPanelProps {
    name: string;
    description: string;
    sizes: ProductOption<PizzaSize>[];
    crusts: ProductOption<PizzaCrust>[];
    addons: ProductAddonModel[];
    chooseSizeLabel: string;
    chooseCrustLabel: string;
    addExtrasLabel: string;
    addToCartLabel: string;
    sizeValue?: PizzaSize;
    onSizeChange?: (value: PizzaSize) => void;
    crustValue?: PizzaCrust;
    onCrustChange?: (value: PizzaCrust) => void;
    selectedAddonIds?: string[];
    onSelectedAddonIdsChange?: (ids: string[]) => void;
    onAddToCart?: () => void;
    addToCartDisabled?: boolean;
    compact?: boolean;
    className?: string;
    buttonClassName?: string;
}

export const ProductCustomizationPanel = ({
    name,
    description,
    sizes,
    crusts,
    addons,
    chooseSizeLabel,
    chooseCrustLabel,
    addExtrasLabel,
    addToCartLabel,
    sizeValue,
    onSizeChange,
    crustValue,
    onCrustChange,
    selectedAddonIds,
    onSelectedAddonIdsChange,
    onAddToCart,
    addToCartDisabled = false,
    compact = false,
    className,
    buttonClassName,
}: ProductCustomizationPanelProps) => {
    return (
        <div className={cn("flex-1", className)}>
            <header className={cn(compact ? "mb-3" : "mb-5 sm:mb-8")}>
                <h1
                    className={cn(
                        compact
                            ? "mb-1.5 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl"
                            : "mb-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl",
                    )}
                >
                    {name}
                </h1>
                <p
                    className={cn(
                        compact
                            ? "text-xs leading-relaxed font-medium text-gray-500 sm:text-sm"
                            : "text-sm leading-relaxed font-medium text-gray-500 sm:text-base md:text-lg",
                    )}
                >
                    {description}
                </p>
            </header>

            <section className={cn(compact ? "space-y-3" : "space-y-5 sm:space-y-8")}>
                {sizes.length > 0 && (
                    <div className={cn(compact ? "space-y-1.5" : "space-y-2 sm:space-y-3")}>
                        <p
                            className={cn(
                                compact
                                    ? "text-xs font-semibold tracking-wide text-gray-400 uppercase"
                                    : "text-sm font-bold tracking-wider text-gray-400 uppercase",
                            )}
                        >
                            {chooseSizeLabel}
                        </p>
                        <SegmentedControl
                            className="w-full max-w-md"
                            options={sizes}
                            value={sizeValue}
                            defaultValue={sizes[0]?.value}
                            onChange={(value) => onSizeChange?.(value as PizzaSize)}
                        />
                    </div>
                )}

                {crusts.length > 0 && (
                    <div className={cn(compact ? "space-y-1.5" : "space-y-2 sm:space-y-3")}>
                        <p
                            className={cn(
                                compact
                                    ? "text-xs font-semibold tracking-wide text-gray-400 uppercase"
                                    : "text-sm font-bold tracking-wider text-gray-400 uppercase",
                            )}
                        >
                            {chooseCrustLabel}
                        </p>
                        <SegmentedControl
                            className="w-full max-w-md"
                            options={crusts}
                            value={crustValue}
                            defaultValue={crusts[0]?.value}
                            onChange={(value) => onCrustChange?.(value as PizzaCrust)}
                        />
                    </div>
                )}

                {addons.length > 0 && (
                    <div className={cn(compact ? "space-y-1.5" : "space-y-2 sm:space-y-3")}>
                        <p
                            className={cn(
                                compact
                                    ? "text-xs font-semibold tracking-wide text-gray-400 uppercase"
                                    : "text-sm font-bold tracking-wider text-gray-400 uppercase",
                            )}
                        >
                            {addExtrasLabel}
                        </p>
                        <IngredientSelect
                            addons={addons}
                            selectedIds={selectedAddonIds}
                            onSelectedIdsChange={onSelectedAddonIdsChange}
                        />
                    </div>
                )}
            </section>

            <Button
                type="button"
                className={cn(
                    compact
                        ? "mt-4 w-full max-md:w-full"
                        : "mt-6 w-full sm:mt-10 sm:w-auto max-md:w-full",
                    buttonClassName,
                )}
                size="lg"
                disabled={addToCartDisabled}
                onClick={onAddToCart}
            >
                {addToCartLabel}
            </Button>
        </div>
    );
};
