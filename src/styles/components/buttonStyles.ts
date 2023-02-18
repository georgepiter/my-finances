import { defineStyleConfig } from "@chakra-ui/react";

export const ButtonStyles = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {},
  // Two sizes: sm and md
  sizes: {},

  // Two variants: outline and solid
  variants: {
    primary: {
      bg: "primary.500",
      color: "white",
      _hover: {
        bg: "primary.300",
      },

      // _dark: {
      //   bg: "primary.200",
      // },
    },
    secondary: {
      bg: "secondary.500",
      color: "white",
      _hover: {
        bg: "secondary.300",
      },
    },
  },
  // The default size and variant values
  defaultProps: {},
});