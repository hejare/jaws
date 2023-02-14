import initializeFirebase from "@jaws/auth/initializeFirebase";
import {
  AppWrapper,
  ExtendedAppProps,
} from "@jaws/components/molecules/AppWrapper";
import { SessionExpirationTracker } from "@jaws/components/SessionExpirationTracker";
import { AccountProvider } from "@jaws/store/account/AccountProvider";
import "@jaws/styles/fonts.css";
import "@jaws/styles/globals.css";
import themes from "@jaws/styles/themes";
import Head from "next/head";
import { createGlobalStyle, ThemeProvider } from "styled-components";

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

initializeFirebase();

function MyApp(appProps: ExtendedAppProps) {
  const { authedUser } = appProps.pageProps;

  return (
    <>
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
        <AccountProvider user={authedUser}>
          <SessionExpirationTracker>
            <AppWrapper {...appProps} />
          </SessionExpirationTracker>
        </AccountProvider>
      </ThemeProvider>
      <GlobalStyle />
    </>
  );
}

export default MyApp;
