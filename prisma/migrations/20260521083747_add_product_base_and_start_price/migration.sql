-- AlterTable: adaugă coloane nullable, backfill din variante, apoi NOT NULL
ALTER TABLE "Product" ADD COLUMN "basePrice" INTEGER;
ALTER TABLE "Product" ADD COLUMN "startPrice" INTEGER;

UPDATE "Product" AS p
SET
    "startPrice" = COALESCE(
        (SELECT MIN(v."price") FROM "ProductVariant" AS v WHERE v."productId" = p."id"),
        2800
    ),
    "basePrice" = COALESCE(
        (SELECT MIN(v."price") FROM "ProductVariant" AS v WHERE v."productId" = p."id"),
        2800
    );

ALTER TABLE "Product" ALTER COLUMN "basePrice" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "startPrice" SET NOT NULL;
