import { PizzaCrust, PizzaSize } from "@prisma/client";

export const PIZZA_SIZE_ORDER: PizzaSize[] = [
    PizzaSize.SMALL,
    PizzaSize.MEDIUM,
    PizzaSize.LARGE,
];

export const PIZZA_CRUST_ORDER: PizzaCrust[] = [
    PizzaCrust.TRADITIONAL,
    PizzaCrust.THIN,
];
