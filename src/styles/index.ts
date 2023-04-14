import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

import { ButtonStyles as Button } from "./components/buttonStyles";

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },

  colors: {
    transparent: "transparent",

    background: "red",

    white: "#FFFFFF",
    black: "#000000",

    primary: {
      200: "#D6BCFA",
      300: "#B794F4",
      400: "#9F7AEA",
      500: "#805AD5",
      600: "#6B46C1",
      700: "#553C9A",
      800: "#44337A",
      900: "#322659",
    },

    secondary: {
      200: "#9DECF9",
      300: "#76E4F7",
      400: "#0BC5EA",
      500: "#00B5D8",
      600: "#00A3C4",
      700: "#0987A0",
      800: "#086F83",
      900: "#065666",
    },

    gray: {
      50: "#f1f1f2",
      100: "#d3d3d6",
      200: "#bebec2",
      300: "#a0a0a6",
      400: "#71717a",
      500: "#505057",
      600: "#3e3e43",
      700: "#2f2f33",
      800: "#262629",
      900: "#1a1a1c",
    },
  },

  components: {
    Button,
  },

  styles: {
    global: (props: any) => ({
      "html, body": {
        background: mode("gray.50", "gray.900")(props), //mode(light mode color, dark mode color)
      },
    }),
  },
});