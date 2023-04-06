
import { Box, Container, Hide, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import Image from "next/image";
import Link from "next/link";

import pig from "../../assets/pig.png";
import logo from "../../assets/_light/logo.png";

interface Props {
  children: React.ReactNode;
}

export default function PanelRightBrand({ children }: Props) {
  return (
    <>
      <SimpleGrid columns={{ md: 2, sm: 1 }} spacing={0} w="100%" h="100%">
        <Box mt={20} h="calc(100vh)">
          {children}
        </Box>

        <Hide below="md">
          <Box
            bgGradient="linear(to-l, primary.500, primary.700)"
            h="calc(100vh)"
          >
            <Container mt={20}>
              <Link href="/">
                <Image
                  src={logo}
                  alt="Brand Image"
                  style={{ height: "auto", width: "90%" }}
                />
              </Link>
              <Stack alignItems="center">
                <Image
                  src={pig}
                  alt="Pig Image"
                  style={{ height: "auto", width: "50%", marginTop: "10px" }}
                />
              </Stack>
            </Container>
          </Box>
        </Hide>
      </SimpleGrid>
    </>
  );
}
