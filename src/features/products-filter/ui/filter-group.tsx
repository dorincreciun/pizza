"use client";

import { Checkbox, Title } from "@shared/ui";

type BaseFilterOption = {
    id: string;
    name: string;
};

interface FilterGroupProps<T> {
    name?: string;
    items: T[];
    isChecked: (id: string) => boolean;
    onToggle: (id: string) => void;
}

export const FilterGroup = <T extends BaseFilterOption>({
    name,
    items,
    isChecked,
    onToggle,
}: FilterGroupProps<T>) => {
    return (
        <div className="flex flex-col gap-3">
            {name && <Title as="h3">{name}</Title>}

            <Checkbox.Group>
                {items.map((item) => (
                    <Checkbox key={item.id} name={item.id}>
                        <Checkbox.Field
                            checked={isChecked(item.id)}
                            onChange={() => onToggle(item.id)}
                        />
                        <Checkbox.Label>{item.name}</Checkbox.Label>
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </div>
    );
};
