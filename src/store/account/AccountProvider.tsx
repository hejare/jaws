import { PropsWithChildren, useRef } from "react";
import { AccountContext } from "./accountContext";
import { AccountStore, createAccountStore, User } from "./accountStore";

type AccountProviderProps = PropsWithChildren<{
  user: User | null;
}>;

export const AccountProvider = ({
  children,
  ...props
}: AccountProviderProps) => {
  const storeRef = useRef<AccountStore>();

  if (!storeRef.current) {
    storeRef.current = createAccountStore({
      user: props.user,
      isLoggedIn: !!props.user,
    });
  }

  return (
    <AccountContext.Provider value={storeRef.current}>
      {children}
    </AccountContext.Provider>
  );
};
