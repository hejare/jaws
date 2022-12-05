import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import "../styles/fonts.css";
import themes from "../styles/themes";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { ModalProvider } from "use-modal-hook";
import Navbar from "../components/organisms/Navbar";
import initializeFirebase from "../auth/initializeFirebase";
import { createAccountStore, User } from "../store/accountStore";
import PageContainer from "../components/atoms/PageContainer";
import { useRef, useState } from "react";
import { AccountContext } from "../store/accountContext";
import { useStore } from "zustand";
import ErrorMessage from "../components/atoms/ErrorMessage";
import { useClickAnyWhere, useInterval } from "usehooks-ts";
import { refresh } from "../auth/firestoreAuth";
import { setCookies } from "cookies-next";
import {
  ONE_HOUR_IN_MS,
  ONE_MINUTE_IN_MS,
  SESSION_LENGTH_IN_MS,
  TEN_MINUTES_IN_MS,
} from "../lib/helpers";

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
  const [interval, setInterval] = useState(SESSION_LENGTH_IN_MS);
  const isLoggedIn = useStore(store, (state) => state.isLoggedIn);
  const [user, setUser, logoutUser] = useStore(store, (state) => [
    state.user,
    state.setUser,
    state.logoutUser,
  ]);

  // TODO: This interval could be extracted in aseparate hook or such, so that this file gets cleaner
  let latestInteraction = Date.now();
  useClickAnyWhere(() => {
    latestInteraction = Date.now();
    setInterval(0);

    async function doRefresh() {
      if (
        !user ||
        (user.sessionExpires &&
          user.sessionExpires - Date.now() > SESSION_LENGTH_IN_MS)
      ) {
        // Only refresh token if less then SESSION_LENGTH_IN_MS left
        return;
      }

      try {
        const newToken = await refresh();
        if (newToken) {
          setCookies("idToken", newToken);
          setUser({
            ...user,
            sessionExpires: Date.now() + ONE_HOUR_IN_MS,
          });
        }
      } catch (err) {
        console.log("Refresh token failed", JSON.stringify(err));
      }
    }
    void doRefresh();
  });

  useInterval(() => {
    setInterval(SESSION_LENGTH_IN_MS);
    if (user && Date.now() - latestInteraction > SESSION_LENGTH_IN_MS) {
      // Session time expired - lets logout
      logoutUser();
      return;
    }
  }, interval);

  return (
    <>
      <Head>
        <title>Jaws</title>
        <meta name="description" content="Jaws - the Frontend for Sharkster" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, maximum-scale=5, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
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
    </>
  );
}

export default MyApp;
