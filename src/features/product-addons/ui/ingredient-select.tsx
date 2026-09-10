"use client";

import { useMemo } from "react";
import "swiper/css";
import { Autoplay, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { ProductAddonModel } from "@entities/product";

import { IngredientItem } from "./ingredient-item";

interface IngredientSelectProps {
    addons: ProductAddonModel[];
    selectedIds?: string[];
    onSelectedIdsChange?: (ids: string[]) => void;
}

export const IngredientSelect = ({
    addons,
    selectedIds = [],
    onSelectedIdsChange,
}: IngredientSelectProps) => {
    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    const handleToggle = (addon: ProductAddonModel) => {
        const nextIds = selectedSet.has(addon.id)
            ? selectedIds.filter((id) => id !== addon.id)
            : [...selectedIds, addon.id];

        onSelectedIdsChange?.(nextIds);
    };

    if (!addons.length) {
        return null;
    }

    return (
        <div>
            <Swiper
                modules={[Virtual, Autoplay]}
                spaceBetween={10}
                slidesPerView={2.2}
                breakpoints={{
                    480: { slidesPerView: 2.8, spaceBetween: 12 },
                    640: { slidesPerView: 3.2, spaceBetween: 14 },
                    1024: { slidesPerView: 3.8, spaceBetween: 14 },
                }}
                virtual
                speed={550}
                rewind
                autoplay={{
                    delay: 2300,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
            >
                {addons.map((addon, index) => (
                    <SwiperSlide key={addon.id} virtualIndex={index}>
                        <IngredientItem
                            image={addon.imageUrl}
                            name={addon.name}
                            price={addon.extraPrice}
                            isActive={selectedSet.has(addon.id)}
                            onClick={() => handleToggle(addon)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
