
import { Link as LinkBase, LinkProps, useColorMode } from "@chakra-ui/react";

interface Props extends LinkProps {
  title: string;
  color?: string;
}

export default function Link({ title, color = "title", ...rest }: Props) {
  const { colorMode } = useColorMode();
  const colorLink = colorMode== "dark" && color == "title"? "gray.50": color;

  return (
    <>
      <LinkBase color={colorLink} {...rest}>
        {title}
      </LinkBase>
    </>
  );
}
