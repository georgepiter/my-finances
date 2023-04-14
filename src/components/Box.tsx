import { Box as BoxBase, BoxProps, Heading, useColorMode } from "@chakra-ui/react";

interface Props extends BoxProps {
  children: React.ReactNode;
  title?: string;
}

export default function Box({ title='', children }: Props) {

const { colorMode } = useColorMode();
  return (
    <BoxBase
      borderRadius="md"
      bg={colorMode === "dark" ? "gray.800" : "white"}
      w="100%"
      p={4}
      boxShadow="md"
    >
      {title != "" && (
        <Heading as="h4" size="md">
          {title}
        </Heading>
      )}
      {children}
    </BoxBase>
  );
}
