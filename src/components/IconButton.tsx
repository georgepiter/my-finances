import {
  IconButton as IconButtonBase,
  IconButtonProps,
  useColorMode,
} from "@chakra-ui/react";

interface Props extends IconButtonProps {
  icon: React.ReactElement;
}

export default function IconButton({ icon, ...rest }: Props) {
  const { colorMode } = useColorMode();

  return (
    <>
      <IconButtonBase
        {...rest}
        size="md"
        rounded={20}
        boxShadow="md"
        colorScheme="blue"
        bgColor={colorMode == "dark" ? "primary.600" : "primary.500"}
        _hover={{ bg: "primary.400" }}
        color="white"
        aria-label="Insert Debt"
        icon={icon}
      />
    </>
  );
}
