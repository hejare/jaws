// Alpaca API requires: Limit price >=$1.00: Max Decimals= 2. Limit price <$1.00: Max Decimals = 4.

export const handleLimitPrice = (floatValue: number) => {
  if (floatValue < 1) {
    return parseFloat(floatValue.toFixed(4));
  }
  return parseFloat(floatValue.toFixed(2));
};
