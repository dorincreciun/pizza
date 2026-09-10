import Image from "next/image";

import { cn } from "@shared/utils";

interface IngredientItemProps {
    name: string;
    image?: string | null;
    price: string;
    isActive: boolean;
    onClick: () => void;
}

export const IngredientItem = ({
    name,
    image,
    price,
    isActive,
    onClick,
}: IngredientItemProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "rounded-xl border p-2 sm:rounded-2xl sm:p-3",
                "flex cursor-pointer flex-col items-center gap-1.5 sm:gap-2",
                "transition-all duration-300 ease-in-out",
                isActive
                    ? "border-[#FE5F00] bg-[#FE5F00]/5 shadow-sm"
                    : "border-transparent hover:border-gray-300 hover:bg-gray-50",
                "focus-visible:ring-2 focus-visible:ring-[#FE5F00] focus-visible:outline-none",
            )}
        >
            <div className="overflow-hidden rounded-xl">
                <Image
                    src={image || ""}
                    alt={name}
                    width={110}
                    height={110}
                    className={cn(
                        "h-20 w-20 rounded-xl object-cover transition-transform duration-300 ease-in-out sm:h-[110px] sm:w-[110px]",
                        isActive ? "scale-105" : "group-hover:scale-105",
                    )}
                />
            </div>

            <div className="flex flex-1 flex-col justify-between gap-1 text-center">
                <div className="text-[11px] font-normal text-gray-700 sm:text-xs">{name}</div>
                <div className="text-xs font-semibold text-gray-900 sm:text-sm">
                    {price}
                </div>
            </div>
        </div>
    );
};
