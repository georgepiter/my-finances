import { Center, Spinner as SpinnerBase, SpinnerProps } from "@chakra-ui/react";

interface Props extends SpinnerProps {
  color?: string;
  size?: string;
}

export default function Spinner({ color = "blue.500", size="lg", ...rest }: Props) {
  return (
    <>
      <Center>
        <SpinnerBase
          thickness="4px"
          speed="0.65s"
          emptyColor="primary.500"
          color={color}
          size={size}
          {...rest}
        />
      </Center>
    </>
  );
}
