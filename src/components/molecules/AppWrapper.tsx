import { useAccountStore } from "@jaws/store/account/accountContext";
import { User } from "@jaws/store/account/accountStore";
import { AppProps } from "next/app";
import { ModalProvider } from "use-modal-hook";
import ErrorMessage from "../atoms/ErrorMessage";
import PageContainer from "../atoms/PageContainer";
import Navbar from "../organisms/Navbar";

export type AuthError = {
  message: string;
  code: string;
};
export interface ExtendedAppProps extends AppProps {
  pageProps: {
    authedUser: User | null;
    authError?: AuthError;
  };
}

export const AppWrapper = ({ Component, ...appProps }: ExtendedAppProps) => {
  const { authError } = appProps.pageProps;

  const isLoggedIn = useAccountStore((state) => state.isLoggedIn);

  return (
    <>
      <Navbar />
      {isLoggedIn ? (
        <ModalProvider>
          <Component {...appProps.pageProps} />
        </ModalProvider>
      ) : (
        <PageContainer>
          <h1>You need to Log in</h1>
          {authError && (
            <ErrorMessage>
              {authError.message} {authError.code && `(${authError.code})`}
            </ErrorMessage>
          )}
        </PageContainer>
      )}
    </>
  );
};
