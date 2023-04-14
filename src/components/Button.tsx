import {
  Button as ButtonBase,
  ButtonProps
} from "@chakra-ui/react";

interface Props extends ButtonProps {
  title: string;
  color?: string;
}

export default function Button({ title, color = "primary", ...rest }: Props) {
  return (
    <>
      <ButtonBase variant={color} {...rest}>{title}</ButtonBase>
    </>
  );
}
