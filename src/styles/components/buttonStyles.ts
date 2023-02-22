import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const ButtonStyles = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {},
  // Two sizes: sm and md
  sizes: {},

  // Two variants: outline and solid
  variants: {
    primary: (props) => ({
      color: mode("white", "white")(props),
      bg: mode("primary.500", "primary.600")(props),
      _hover: {
        bg: "primary.400",
      },
    }),

    secondary: (props) => ({
      bg: mode("secondary.600", "secondary.600")(props),
      color: mode("white", "white")(props),
      _hover: {
        bg: "secondary.400",
      },
    }),
  
  },
  defaultProps: {},
});