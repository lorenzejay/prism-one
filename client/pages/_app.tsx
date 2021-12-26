import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../utils/queryClient";
import "react-form-builder2/dist/app.css";
import { AuthUserProvider } from "../context/AuthUserContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.13.0/css/all.css"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AuthUserProvider>
          <Component {...pageProps} />
        </AuthUserProvider>
      </QueryClientProvider>
    </>
  );
}
export default MyApp;
