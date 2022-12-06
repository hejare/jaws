import create from "zustand";

export type BreakoutStoreType = {
  image: string;
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  configRef: string;
  breakoutRef: string;
  rating?: number;
};

interface BreakoutsProps {
  breakouts: BreakoutStoreType[];
}

export interface BreakoutsState extends BreakoutsProps {
  setBreakouts: (breakouts: BreakoutStoreType[]) => void;
  setRating: (breakoutRef: string, value: number) => void;
}

export const useBreakoutsStore = create<BreakoutsState>((set) => ({
  breakouts: [],
  setBreakouts: (breakouts: BreakoutStoreType[]) =>
    set((state) => ({
      ...state,
      breakouts: [...breakouts],
    })),
  setRating: (breakoutRef: string, value: number) =>
    set((state) => ({
      ...state,
      breakouts: [
        ...state.breakouts.map((breakout) =>
          breakout.breakoutRef === breakoutRef
            ? { ...breakout, rating: value }
            : breakout,
        ),
      ],
    })),
}));
