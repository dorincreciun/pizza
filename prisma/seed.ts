import {
    PizzaCrust,
    PizzaSize,
    UserLanguage,
    VariantType,
    type Prisma, PrismaClient,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {PrismaPg} from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});


const IMGS_DIR = join(process.cwd(), "public", "imgs");
const IMG_PUBLIC_PREFIX = "/imgs";

const PRODUCT_COUNT = 120;

/** Preț de referință (bani) pentru varianta SMALL + TRADITIONAL. */
const BASE_PRICE_MIN = 2800;
const BASE_PRICE_MAX = 6500;

const DEFAULT_SIZE = PizzaSize.SMALL;
const DEFAULT_CRUST = PizzaCrust.TRADITIONAL;

const LOCALES = [UserLanguage.EN, UserLanguage.RO, UserLanguage.RU] as const;

const PIZZA_SIZES = Object.values(PizzaSize);
const PIZZA_CRUSTS = Object.values(PizzaCrust);

type LocaleStrings = Record<(typeof LOCALES)[number], string>;

const CATEGORIES: LocaleStrings[] = [
    {
        RO: "Clasice",
        EN: "Classics",
        RU: "Классические",
    },
    {
        RO: "Vegetariene",
        EN: "Vegetarian",
        RU: "Вегетарианские",
    },
    {
        RO: "Premium",
        EN: "Premium",
        RU: "Премиум",
    },
    {
        RO: "Picante",
        EN: "Spicy",
        RU: "Острые",
    },
    {
        RO: "Copii",
        EN: "Kids",
        RU: "Детские",
    },
    {
        RO: "Sezon",
        EN: "Seasonal",
        RU: "Сезонные",
    },
    {
        RO: "Fără gluten",
        EN: "Gluten free",
        RU: "Без глютена",
    },
    {
        RO: "Specialități",
        EN: "Specialties",
        RU: "Фирменные",
    },
];

type ToppingSeed = { extraPrice: number; names: LocaleStrings };

const TOPPINGS: ToppingSeed[] = [
    {
        extraPrice: 0,
        names: { RO: "Mozzarella", EN: "Mozzarella", RU: "Моцарелла" },
    },
    {
        extraPrice: 800,
        names: { RO: "Parmezan", EN: "Parmesan", RU: "Пармезан" },
    },
    {
        extraPrice: 1200,
        names: { RO: "Gorgonzola", EN: "Gorgonzola", RU: "Горгонзола" },
    },
    {
        extraPrice: 1000,
        names: { RO: "Șuncă", EN: "Ham", RU: "Ветчина" },
    },
    {
        extraPrice: 1100,
        names: { RO: "Bacon", EN: "Bacon", RU: "Бекон" },
    },
    {
        extraPrice: 1200,
        names: { RO: "Salam picant", EN: "Spicy salami", RU: "Острая салями" },
    },
    {
        extraPrice: 1200,
        names: { RO: "Pepperoni", EN: "Pepperoni", RU: "Пепперони" },
    },
    {
        extraPrice: 600,
        names: { RO: "Ciuperci", EN: "Mushrooms", RU: "Грибы" },
    },
    {
        extraPrice: 500,
        names: { RO: "Măsline", EN: "Olives", RU: "Оливки" },
    },
    {
        extraPrice: 500,
        names: { RO: "Porumb", EN: "Corn", RU: "Кукуруза" },
    },
    {
        extraPrice: 600,
        names: { RO: "Ardei gras", EN: "Bell pepper", RU: "Болгарский перец" },
    },
    {
        extraPrice: 400,
        names: { RO: "Ceapă", EN: "Onion", RU: "Лук" },
    },
    {
        extraPrice: 700,
        names: {
            RO: "Roșii cherry",
            EN: "Cherry tomatoes",
            RU: "Черри-томаты",
        },
    },
    {
        extraPrice: 700,
        names: { RO: "Ananas", EN: "Pineapple", RU: "Ананас" },
    },
    {
        extraPrice: 800,
        names: { RO: "Rucola", EN: "Arugula", RU: "Руккола" },
    },
    {
        extraPrice: 1500,
        names: { RO: "Prosciutto", EN: "Prosciutto", RU: "Прошутто" },
    },
    {
        extraPrice: 1300,
        names: { RO: "Ton", EN: "Tuna", RU: "Тунец" },
    },
    {
        extraPrice: 1800,
        names: { RO: "Creveți", EN: "Shrimp", RU: "Креветки" },
    },
    {
        extraPrice: 600,
        names: { RO: "Ou", EN: "Egg", RU: "Яйцо" },
    },
    {
        extraPrice: 400,
        names: {
            RO: "Busuioc proaspăt",
            EN: "Fresh basil",
            RU: "Свежий базилик",
        },
    },
];

const ADJECTIVES: LocaleStrings[] = [
    { RO: "Clasică", EN: "Classic", RU: "Классическая" },
    { RO: "Picantă", EN: "Spicy", RU: "Острая" },
    { RO: "Cremoasă", EN: "Creamy", RU: "Сливочная" },
    { RO: "Rustică", EN: "Rustic", RU: "Деревенская" },
    { RO: "Deluxe", EN: "Deluxe", RU: "Делюкс" },
    { RO: "Supreme", EN: "Supreme", RU: "Суприм" },
    { RO: "Artizanală", EN: "Artisan", RU: "Ремесленная" },
    { RO: "Tradițională", EN: "Traditional", RU: "Традиционная" },
    { RO: "Foc", EN: "Fire", RU: "Огненная" },
    { RO: "Regală", EN: "Royal", RU: "Королевская" },
];

const STYLES: LocaleStrings[] = [
    { RO: "Margherita", EN: "Margherita", RU: "Маргарита" },
    { RO: "Diavola", EN: "Diavola", RU: "Дьявола" },
    { RO: "Quattro Formaggi", EN: "Quattro Formaggi", RU: "Четыре сыра" },
    { RO: "Capricciosa", EN: "Capricciosa", RU: "Капричоза" },
    { RO: "Prosciutto", EN: "Prosciutto", RU: "Прошутто" },
    { RO: "Tonno", EN: "Tuna", RU: "Тунец" },
    { RO: "Vegetariana", EN: "Vegetarian", RU: "Вегетарианская" },
    { RO: "BBQ", EN: "BBQ", RU: "Барбекю" },
    { RO: "Hawaiian", EN: "Hawaiian", RU: "Гавайская" },
    { RO: "Napoletana", EN: "Neapolitan", RU: "Неаполитанская" },
    { RO: "Romana", EN: "Roman", RU: "Римская" },
    { RO: "Calzone", EN: "Calzone", RU: "Кальцоне" },
    { RO: "Bianca", EN: "Bianca", RU: "Бьянка" },
    { RO: "Pepperoni", EN: "Pepperoni", RU: "Пепперони" },
    { RO: "Mediterranean", EN: "Mediterranean", RU: "Средиземноморская" },
];

function translationCreates<T extends LocaleStrings>(
    names: T,
): Prisma.CategoryTranslationCreateWithoutCategoryInput[] {
    return LOCALES.map((locale) => ({
        locale,
        name: names[locale],
    }));
}

function ingredientTranslationCreates(
    names: LocaleStrings,
): Prisma.IngredientTranslationCreateWithoutIngredientInput[] {
    return LOCALES.map((locale) => ({
        locale,
        name: names[locale],
    }));
}

function productTranslationCreates(
    names: LocaleStrings,
    style: LocaleStrings,
    sauceCount: number,
): Prisma.ProductTranslationCreateWithoutProductInput[] {
    const shortByLocale: LocaleStrings = {
        RO: `Pizza ${style.RO} — porție generoasă, gata în câteva minute.`,
        EN: `${style.EN} pizza — generous portion, ready in minutes.`,
        RU: `Пицца ${style.RU} — щедрая порция, готова за несколько минут.`,
    };

    const descriptionByLocale: LocaleStrings = {
        RO: `${names.RO} cu ${sauceCount} sos(uri) distinct(e) și topping-uri alese.`,
        EN: `${names.EN} with ${sauceCount} distinct sauce(s) and selected toppings.`,
        RU: `${names.RU} с ${sauceCount} соус(ами) и выбранными топпингами.`,
    };

    return LOCALES.map((locale) => ({
        locale,
        name: names[locale],
        shortDescription: shortByLocale[locale],
        description: descriptionByLocale[locale],
    }));
}

function listImages(prefix: string): string[] {
    if (!existsSync(IMGS_DIR)) {
        return [];
    }
    return readdirSync(IMGS_DIR)
        .filter((file) => file.toLowerCase().startsWith(prefix))
        .filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file))
        .map((file) => `${IMG_PUBLIC_PREFIX}/${file}`);
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(items: T[]): T {
    return items[randomInt(0, items.length - 1)]!;
}

function pickUnique<T>(items: T[], count: number): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        [copy[i], copy[j]] = [copy[j]!, copy[i]!];
    }
    return copy.slice(0, Math.min(count, copy.length));
}

function sauceNamesFromPath(imagePath: string): LocaleStrings {
    const base = imagePath
        .split("/")
        .pop()!
        .replace(/\.[^.]+$/, "")
        .toLowerCase();

    const namedSauces: Record<string, LocaleStrings> = {
        "sos-1": {
            EN: "Garlic sauce",
            RO: "Sos de usturoi",
            RU: "Чесночный соус",
        },
        "sos-2": {
            EN: "BBQ sauce",
            RO: "Sos BBQ",
            RU: "Соус барбекю",
        },
        "sos-3": {
            EN: "Tomato sauce",
            RO: "Sos de roșii",
            RU: "Томатный соус",
        },
        "sos-4": {
            EN: "Cheese sauce",
            RO: "Sos de brânză",
            RU: "Сырный соус",
        },
        "sos-5": {
            EN: "Spicy sauce",
            RO: "Sos picant",
            RU: "Острый соус",
        },
        "sos-6": {
            EN: "Herb sauce",
            RO: "Sos de ierburi",
            RU: "Травяной соус",
        },
    };

    return (
        namedSauces[base] ?? {
            RO: "Sos",
            EN: "Sauce",
            RU: "Соус",
        }
    );
}

function buildProductName(
    adjective: LocaleStrings,
    style: LocaleStrings,
    index: number,
): LocaleStrings {
    return {
        RO: `${adjective.RO} ${style.RO} ${index + 1}`,
        EN: `${adjective.EN} ${style.EN} ${index + 1}`,
        RU: `${adjective.RU} ${style.RU} ${index + 1}`,
    };
}

type VariantSeed = {
    size: PizzaSize;
    crust: PizzaCrust;
    price: number;
    variantType: VariantType;
};

function variantPrice(
    referencePrice: number,
    size: PizzaSize,
    crust: PizzaCrust,
) {
    const sizeMultiplier =
        size === PizzaSize.SMALL ? 1 : size === PizzaSize.MEDIUM ? 1.25 : 1.5;
    const crustAdjustment = crust === PizzaCrust.THIN ? -200 : 0;

    return Math.round(referencePrice * sizeMultiplier + crustAdjustment);
}

function buildAllVariants(referencePrice: number): VariantSeed[] {
    return PIZZA_SIZES.flatMap((size) =>
        PIZZA_CRUSTS.map((crust) => ({
            size,
            crust,
            price: variantPrice(referencePrice, size, crust),
            variantType: VariantType.PIZZA,
        })),
    );
}

function resolveProductPrices(referencePrice: number) {
    const allVariants = buildAllVariants(referencePrice);
    const variantCount = randomInt(2, allVariants.length);
    const variants = pickUnique(allVariants, variantCount);

    const displayVariant =
        variants.find(
            (variant) =>
                variant.size === DEFAULT_SIZE &&
                variant.crust === DEFAULT_CRUST,
        ) ?? variants[0]!;

    return {
        basePrice: displayVariant.price,
        variants,
    };
}

async function main() {
    const pizzaImages = listImages("pizza-");
    const sauceImages = listImages("sos-");

    if (pizzaImages.length === 0) {
        throw new Error(
            `Nu există imagini pizza-* în ${IMGS_DIR}. Adaugă fișiere care încep cu "pizza-".`,
        );
    }
    if (sauceImages.length === 0) {
        throw new Error(
            `Nu există imagini sos-* în ${IMGS_DIR}. Adaugă fișiere care încep cu "sos-".`,
        );
    }

    console.log(
        `Imagini: ${pizzaImages.length} pizza, ${sauceImages.length} sosuri`,
    );

    console.log("Șterg date existente...");
    await prisma.$transaction([
        prisma.productVariant.deleteMany(),
        prisma.product.deleteMany(),
        prisma.ingredient.deleteMany(),
        prisma.category.deleteMany(),
    ]);

    const categories = await Promise.all(
        CATEGORIES.map((names) =>
            prisma.category.create({
                data: {
                    translations: {
                        create: translationCreates(names),
                    },
                },
            }),
        ),
    );

    const toppingRecords = await Promise.all(
        TOPPINGS.map((topping, index) =>
            prisma.ingredient.create({
                data: {
                    extraPrice: topping.extraPrice,
                    imageUrl: sauceImages[index % sauceImages.length]!,
                    translations: {
                        create: ingredientTranslationCreates(topping.names),
                    },
                },
            }),
        ),
    );

    const mozzarella = toppingRecords.find(
        (ingredient) => ingredient.extraPrice === 0,
    );

    if (!mozzarella) {
        throw new Error('Ingredientul "Mozzarella" (extraPrice 0) lipsește.');
    }

    const optionalToppings = toppingRecords.filter(
        (ingredient) => ingredient.id !== mozzarella.id,
    );

    const sauceRecords = await Promise.all(
        sauceImages.map((imageUrl) => {
            const names = sauceNamesFromPath(imageUrl);
            return prisma.ingredient.create({
                data: {
                    extraPrice: randomInt(0, 500),
                    imageUrl,
                    translations: {
                        create: ingredientTranslationCreates(names),
                    },
                },
            });
        }),
    );

    console.log(`Creez ${PRODUCT_COUNT} produse...`);

    for (let i = 0; i < PRODUCT_COUNT; i++) {
        const category = pickOne(categories);
        const style = pickOne(STYLES);
        const adjective = pickOne(ADJECTIVES);
        const names = buildProductName(adjective, style, i);
        const referencePrice = randomInt(BASE_PRICE_MIN, BASE_PRICE_MAX);
        const { basePrice, variants } =
            resolveProductPrices(referencePrice);

        const sauceCount = randomInt(1, Math.min(5, sauceRecords.length));
        const saucesForProduct = pickUnique(sauceRecords, sauceCount);

        const extraToppingCount = randomInt(
            2,
            Math.min(7, optionalToppings.length),
        );
        const extraToppings = pickUnique(optionalToppings, extraToppingCount);

        const ingredientIds = [
            ...saucesForProduct.map((sauce) => sauce.id),
            mozzarella.id,
            ...extraToppings.map((topping) => topping.id),
        ];

        await prisma.product.create({
            data: {
                imageUrl: pickOne(pizzaImages),
                basePrice,
                categoryId: category.id,
                ingredients: {
                    connect: ingredientIds.map((id) => ({ id })),
                },
                translations: {
                    create: productTranslationCreates(names, style, sauceCount),
                },
                variants: {
                    create: variants,
                },
            },
        });

        if ((i + 1) % 20 === 0) {
            console.log(`  ${i + 1}/${PRODUCT_COUNT} produse create`);
        }
    }

    const demoPasswordHash = await bcrypt.hash("password123", 12);

    await prisma.user.upsert({
        where: { email: "demo@pizza.local" },
        create: {
            email: "demo@pizza.local",
            passwordHash: demoPasswordHash,
            language: UserLanguage.RO,
        },
        update: {
            passwordHash: demoPasswordHash,
        },
    });

    console.log("Utilizator demo: demo@pizza.local / password123");
    console.log("Seed finalizat cu succes.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
