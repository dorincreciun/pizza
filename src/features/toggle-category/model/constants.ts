/**
 * Sentinel pentru filtrul „toate categoriile” (nu exista in DB).
 * Folosit pentru cheia React si pentru reprezentare in UI; este normalizat
 * la `undefined` inainte de a fi trimis spre `entities/product`.
 */
export const ALL_CATEGORY_ID = "all" as const;

export type AllCategoryId = typeof ALL_CATEGORY_ID;
