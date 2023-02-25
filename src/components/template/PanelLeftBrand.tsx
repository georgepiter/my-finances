

import { Box, Hide, SimpleGrid } from "@chakra-ui/react";
import Image from "next/image";

import bgImage from "../../assets/bg.png";

interface Props {
  children: React.ReactNode;
}

export default function PanelLeftBrand({ children }: Props) {
  return (
    <>
      <SimpleGrid columns={{ md: 2, sm: 1 }} spacing={0} w="100%" h="100%">
        <Hide below="md">
          <Box>
            <Image
              src={bgImage}
              alt="Brand Image"
              style={{ height: "auto", width: "100%" }}
            />
          </Box>
        </Hide>
        <Box>{children}</Box>
      </SimpleGrid>
    </>
  );
}