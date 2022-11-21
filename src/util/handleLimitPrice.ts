// Alpaca API requires: Limit price >=$1.00: Max Decimals= 2. Limit price <$1.00: Max Decimals = 4.

export const handleLimitPrice = (value: string) => {
  const floatValue = parseFloat(value);
  if (floatValue < 1.0) {
    return floatValue.toFixed(4);
  }
  return floatValue.toFixed(2);
};
