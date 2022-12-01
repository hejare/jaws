import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export type User = {
  displayName: string;
  email: string;
  lastSignInTime: string;
};

interface AccountState {
  isLoggedIn: boolean;
  user: User | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoggedIn: false,
        setIsLoggedIn: (isLoggedIn) =>
          set((state) => ({ ...state, isLoggedIn: isLoggedIn })),
        setUser: (user: User | null) =>
          set((state) => ({ ...state, user: user })),
      }),
      {
        name: "account-storage",
      },
    ),
  ),
);
