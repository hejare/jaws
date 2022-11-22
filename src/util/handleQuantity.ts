import { getAccountCashBalance } from "../services/alpacaService";

// Alpaca does not support fractional orders when type "limit" is set. Quantity must be an integer.
// Therefore qty: wallet balance * 0.1 * limit_price => rounded to nearest integer

export const handleCalculateQuantity = async (limit_price: string) => {
  const cachBalance: number = await getAccountCashBalance();
  return (cachBalance * 0.1 * parseFloat(limit_price)).toFixed();
};
