import React from "react";
import { SSRProvider } from "@react-aria/ssr";
import { SessionProvider, useSession } from "next-auth/react";

import { theme } from "@/styles";

import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    </SSRProvider>
  );
}
