"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { CategoryModel } from "@entities/category";
import { Button, Dropdown } from "@shared/ui";
import { cn } from "@shared/utils";

interface OverflowCategoriesProps {
    overflowCategories: CategoryModel[];
    activeId: string;
    onSelect: (id: string) => void;
}

export const OverflowCategories = ({
    overflowCategories,
    activeId,
    onSelect,
}: OverflowCategoriesProps) => {
    const t = useTranslations("widgets.categories");

    return (
        <Dropdown closeOnSelect className="flex-1">
            <Dropdown.Trigger asChild className="flex-1 w-full">
                <Button
                    type="button"
                    kind="ghost"
                    color="secondary"
                    className="h-full shrink-0 gap-1 rounded-2xl px-4 text-base font-medium text-[#202020] hover:text-[#FE5F00]"
                >
                    {t("more")}
                    <ChevronDown size={18} aria-hidden />
                </Button>
            </Dropdown.Trigger>
            <Dropdown.Content align="end" size="sm">
                {overflowCategories.map((category) => (
                    <Dropdown.Item
                        key={category.id}
                        onClick={() => onSelect(category.id)}
                        className={cn(
                            activeId === category.id &&
                                "bg-[#FE5F00]/10 text-[#FE5F00]",
                        )}
                    >
                        {category.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Content>
        </Dropdown>
    );
};
