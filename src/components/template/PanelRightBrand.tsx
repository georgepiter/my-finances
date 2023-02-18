
import { Box, SimpleGrid } from "@chakra-ui/react";

import Image from "next/image";

import bgImage from "../../assets/bg.png";

interface Props {
  children: React.ReactNode;
}

export default function PanelRightBrand({ children }: Props) {
  return (
    <>
      <SimpleGrid columns={2} spacing={0} w="100%" h="100%">
        <Box>{children}</Box>
        <Box>
          <Image
            src={bgImage}
            alt="Brand Image"
            style={{ height: "100%", width: "100%" }}
          />
        </Box>
      </SimpleGrid>
    </>
  );
}
