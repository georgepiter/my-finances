import { Card as CardBase, CardProps, HStack, Skeleton, Text } from "@chakra-ui/react";

interface Props extends CardProps {
  title: string;
  color?: string;
  icon: React.ReactNode;
  value?: number;
  isLoaded?: boolean;
}

export default function CardDashboard({
  title,
  color = "white",
  icon,
  value = 0,
  isLoaded = false,
  ...rest
}: Props) {
  return (
    <>
      <CardBase w="100%" color="white" bg={color} p={5} {...rest}>
        <HStack display="flex" justifyContent="flex-end">
          {icon}
        </HStack>

        <Text as="b" fontSize="md">
          {title}
        </Text>

        <Skeleton isLoaded={isLoaded} w="100%">
          <Text as="b" fontSize="xl">
            {new Intl.NumberFormat("pt-br", {
              style: "currency",
              currency: "BRL",
            }).format(value)}
          </Text>
        </Skeleton>
      </CardBase>
    </>
  );
}
