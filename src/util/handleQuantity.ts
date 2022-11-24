// Alpaca does not support fractional orders when type "limit" is set. Quantity must be an integer.
// Therefore qty: wallet balance * 0.1 * limit_price => rounded to nearest integer

export const handleCalculateQuantity = (
  limit_price: number,
  cashBalance: number,
) => {
  return parseInt(((cashBalance * 0.1) / limit_price).toFixed(), 10);
};
