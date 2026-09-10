/**
 * Public API cross-import pentru `entities/product/`.
 * Citit ca „ingredient @ x produs”. Nu este public pentru layer-ele superioare.
 */
export type { IngredientModel } from "../model/types";
export { mapIngredient } from "../api/mapper";
