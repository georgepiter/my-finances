

import { Box, Center, Container, Hide, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";

import pig from "../../assets/pig.png";
import logo from "../../assets/_light/logo.png";

interface Props {
  children: React.ReactNode;
}

export default function PanelLeftBrand({ children }: Props) {
  return (
    <>
      <SimpleGrid columns={{ md: 2, sm: 1 }} spacing={0} w="100%" h="100%">
        <Hide below="md">
          <Box
            bgGradient="linear(to-l, primary.500, primary.700)"
            h="calc(100vh)"
          >
            <Container mt={20}>
              <Image
                src={logo}
                alt="Brand Image"
                style={{ height: "auto", width: "95%" }}
              />
              <Stack alignItems="center">
                {/* <Image
                  src={logo}
                  alt="Brand Image"
                  style={{ height: "auto", width: "100%" }}
                /> */}
                <Image
                  src={pig}
                  alt="Brand Image"
                  style={{ height: "auto", width: "50%", marginTop: "10px" }}
                />
              </Stack>
            </Container>
          </Box>
        </Hide>
        <Box h="calc(100vh)">{children}</Box>
      </SimpleGrid>
    </>
  );
}