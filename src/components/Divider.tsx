import {
  Divider as DividerBase,
  DividerProps,
  useColorMode,
} from "@chakra-ui/react";

export default function Divider({ ...rest }: DividerProps) {
  const { colorMode } = useColorMode();

  return (
    <>
      <DividerBase
        {...rest}
        mt={2}
        borderColor={colorMode == "dark" ? "secondary.700" : "secondary.500"}
      />
    </>
  );
}
