import initializeFirebase from "@jaws/auth/initializeFirebase";
import ErrorMessage from "@jaws/components/atoms/ErrorMessage";
import PageContainer from "@jaws/components/atoms/PageContainer";
import Navbar from "@jaws/components/organisms/Navbar";
import { SessionExpirationTracker } from "@jaws/components/SessionExpirationTracker";
import { AccountContext } from "@jaws/store/accountContext";
import { createAccountStore, User } from "@jaws/store/accountStore";
import "@jaws/styles/fonts.css";
import "@jaws/styles/globals.css";
import themes from "@jaws/styles/themes";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRef } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { ModalProvider } from "use-modal-hook";
import { useStore } from "zustand";

const theme = themes.dark; // I know, we are now removing ability to switch theme without hard reload, but what the hell...

const GlobalStyle = createGlobalStyle`
  {${theme.typography}}
  body {
    color: ${theme.palette.text.primary};
    background-color: ${theme.palette.background.primary};
  }
  a {
    color: ${theme.palette.action.text};
  }
`;

type AuthError = {
  message: string;
  code: string;
};
interface ExtendedAppProps extends AppProps {
  pageProps: {
    authedUser: User | null;
    authError?: AuthError;
  };
}

initializeFirebase();

function MyApp({ Component, pageProps }: ExtendedAppProps) {
  const { authedUser, authError } = pageProps;
  const store = useRef(
    createAccountStore({
      user: authedUser,
      isLoggedIn: !!authedUser,
    }),
  ).current;
  const isLoggedIn = useStore(store, (state) => state.isLoggedIn);

  return (
    <SessionExpirationTracker>
      <Head>
        <title>Jaws</title>
        <meta name="description" content="Jaws - the Frontend for Sharkster" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://s3.tradingview.com" />
        <meta
          name="viewport"
          content="minimum-scale=1, maximum-scale=5, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <script
          type="text/javascript"
          src="https://s3.tradingview.com/tv.js"
        ></script>
      </Head>
      <ThemeProvider theme={theme}>
        <AccountContext.Provider value={store}>
          <Navbar />
          {isLoggedIn ? (
            <ModalProvider>
              <Component {...pageProps} />
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
        </AccountContext.Provider>
      </ThemeProvider>
      <GlobalStyle />
    </SessionExpirationTracker>
  );
}

export default MyApp;
