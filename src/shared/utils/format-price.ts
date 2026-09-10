/**
 * Formatează sume stocate în bani (ex. 2800 → 28,00 MDL).
 */
export const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'MDL', // sau 'RON', 'EUR'
    }).format(priceInCents / 100);
};