import { createStore } from "zustand";

export type User = {
  userId: string;
  idToken: string;
  displayName: string;
  email: string;
  sessionExpires: number;
};

interface AccountProps {
  isLoggedIn: boolean;
  user: User | null;
}

interface AccountState extends AccountProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User | null) => void;
}

export type AccountStore = ReturnType<typeof createAccountStore>;

export const createAccountStore = (initProps?: Partial<AccountProps>) => {
  const DEFAULT_PROPS: AccountProps = {
    isLoggedIn: false,
    user: null,
  };
  return createStore<AccountState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setIsLoggedIn: (isLoggedIn) =>
      set((state) => ({ ...state, isLoggedIn: isLoggedIn })),
    setUser: (user: User | null) => set((state) => ({ ...state, user: user })),
  }));
};
