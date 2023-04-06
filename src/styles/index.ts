import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

import { ButtonStyles as Button } from "./components/buttonStyles";

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },

  colors: {
    transparent: "transparent",

    background: "red",

    white: "#FFFFFF",
    black: "#000000",

    primary: {
      200: "#90d6f5",
      300: "#5ec3f0",
      400: "#3eb7ed",
      500: "#0ea5e9",
      600: "#0d96d4",
      700: "#0a75a5",
    },

    secondary: {
      200: "#f5b28f",
      300: "#f18f5c",
      400: "#ee793d",
      500: "#ea580c",
      600: "#d5500b",
      700: "#a63e09",
    },

    gray: {
      50: "#f1f1f2",
      100: "#d3d3d6",
      200: "#bebec2",
      300: "#a0a0a6",
      400: "#8d8d95",
      500: "#71717a",
      600: "#505057",
      700: "#3e3e43",
      800: "#2f2f33",
      900: "#262629",
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