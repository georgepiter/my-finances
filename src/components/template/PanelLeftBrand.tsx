

import { Box, Center, Container, Hide, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";

import pig from "../../assets/pig.png";
interface Props {
  children: React.ReactNode;
}

export default function PanelLeftBrand({ children }: Props) {
  return (
    <>
      <SimpleGrid columns={{ md: 2, sm: 1 }} spacing={0} w="100%" h="100%">
        <Hide below="md">
          <Box bg="primary.500" h="calc(100vh)">
            <Container p={20}>
              <Stack spacing={4} alignItems="center" mt={100}>
                <Text as="b" fontSize="4xl" mb={10} color="white">
                  Finances
                </Text>

                <Image
                  src={pig}
                  alt="Brand Image"
                  style={{ height: "auto", width: "70%" }}
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