export function calculateNAV({
  positions,
  equity,
}: {
  positions: { qty: string }[];
  equity: number;
}): number {
  return equity / positions.reduce((sum, p) => parseInt(p.qty) + sum, 0);
}

export function calculateHistoricalNAV(
  days: {
    positions: {
      long_qty: string;
    }[];
    equity: number;
  }[],
): number[] {
  return days.map((day) =>
    calculateNAV({
      positions: day.positions.map(({ long_qty: qty }) => ({ qty })),
      equity: day.equity,
    }),
  );
}
