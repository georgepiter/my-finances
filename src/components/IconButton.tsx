import {
  IconButton as IconButtonBase,
  IconButtonProps,
  useColorMode,
} from "@chakra-ui/react";

interface Props extends IconButtonProps {
  icon: React.ReactElement;
  colorScheme: string;
}

export default function IconButton({ icon, colorScheme, ...rest }: Props) {
  const { colorMode } = useColorMode();

  let bgColor = "";
  let colorHover = "";
  if (colorScheme === "blue") {
    bgColor = colorMode == "dark" ? "primary.600" : "primary.500";
    colorHover = colorMode == "dark" ? "primary.500" : "primary.400";
  } else if (colorScheme === "red") {
    bgColor = colorMode == "dark" ? "red.600" : "red.500";
    colorHover = colorMode == "dark" ? "red.500" : "red.400";
  }

  return (
    <>
      <IconButtonBase
        {...rest}
        size="md"
        rounded={20}
        boxShadow="md"
        bgColor={bgColor}
        _hover={{ bg: colorHover }}
        color="white"
        aria-label="Insert Debt"
        icon={icon}
      />
    </>
  );
}
