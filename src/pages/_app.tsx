import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import "../styles/fonts.css";
import themes from "../styles/themes";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { ModalProvider } from "use-modal-hook";
import Navbar from "../components/organisms/Navbar";

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, maximum-scale=5, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <Navbar />
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </ThemeProvider>
      <GlobalStyle />
    </>
  );
}

export default MyApp;
