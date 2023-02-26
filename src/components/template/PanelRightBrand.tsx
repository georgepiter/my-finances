
import { Box, Container, Hide, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import Image from "next/image";

import pig from "../../assets/pig.png";

interface Props {
  children: React.ReactNode;
}

export default function PanelRightBrand({ children }: Props) {
  return (
    <>
      <SimpleGrid columns={{ md: 2, sm: 1 }} spacing={0} w="100%" h="100%">
        <Box h="calc(100vh)">{children}</Box>

        <Hide below="md">
          <Box bg="primary.500" h="calc(100vh)">
            <Container p={20}>
              <Stack spacing={4} alignItems="center" mt={90}>
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
      </SimpleGrid>
    </>
  );
}
