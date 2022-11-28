// Alpaca API requires: Limit price >=$1.00: Max Decimals= 2. Limit price <$1.00: Max Decimals = 4.

export const handleLimitPrice = (value: number) => {
  try {
    const floatValue = typeof value === "string" ? parseFloat(value) : value;

    if (Math.abs(floatValue) < 1) {
      return parseFloat(floatValue.toFixed(4));
    }
    return parseFloat(floatValue.toFixed(2));
  } catch (e: any) {
    console.warn(e.message, value, typeof value);
    return value;
  }
};
