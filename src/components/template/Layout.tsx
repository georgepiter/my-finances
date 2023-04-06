import { Box, Flex } from "@chakra-ui/react";

import Footer from "./Footer";
import NavbarTop from "./NavbarTop";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Box w="100%">
      <NavbarTop />
      <Box w="100%" h="calc(100vh)">
        <main>{children}</main>
      </Box>
      <Footer />
    </Box>
  );
}
