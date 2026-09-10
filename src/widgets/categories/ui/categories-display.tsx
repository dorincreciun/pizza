"use client";

import { type CategoryModel } from "@entities/category";
import { PriorityNavigation } from "@shared/ui";
import { cn } from "@shared/utils";

import { OverflowCategories } from "./overflow-categories";
import { CategoryButton, useCategory } from "@features/toggle-category";

/** Sub această lățime (px), toate categoriile apar doar în dropdown. */
const CATEGORIES_ALL_IN_DROPDOWN_BELOW_WIDTH_PX = 480;

export type CategoriesDisplayProps = {
    categories: CategoryModel[];
};

export function CategoriesDisplay({ categories }: CategoriesDisplayProps) {
    const { change, activeCategoryId } = useCategory();
    return (
        <PriorityNavigation>
            <PriorityNavigation.Main<CategoryModel>
                height={52}
                allInDropdownBelowWidth={
                    CATEGORIES_ALL_IN_DROPDOWN_BELOW_WIDTH_PX
                }
                className={cn(
                    "relative flex flex-1 items-center rounded-2xl bg-[#FAFAFA] px-2 py-2",
                    "w-full max-w-200 min-w-0 select-none",
                    "focus-within:ring-2 focus-within:ring-[#E0E0E0]",
                    "focus-within:ring-offset-2 focus-within:ring-offset-white",
                    "focus-within:shadow-sm",
                    "transition-all duration-200 ease-in-out",
                )}
                items={categories}
                renderItem={({ id, name }) => (
                    <CategoryButton
                        key={id}
                        layout="fill"
                        isActive={activeCategoryId === id}
                        onClick={() => change(id)}
                    >
                        {name}
                    </CategoryButton>
                )}
                renderMore={(overflowCategories) => (
                    <OverflowCategories
                        overflowCategories={overflowCategories}
                        activeId={activeCategoryId}
                        onSelect={change}
                    />
                )}
            />
        </PriorityNavigation>
    );
}
