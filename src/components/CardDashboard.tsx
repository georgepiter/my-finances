import { Card as CardBase, CardProps, HStack, Text } from "@chakra-ui/react";

interface Props extends CardProps {
  title: string;
  color?: string;
  icon: React.ReactNode;
  value?: number;
}

export default function CardDashboard({ title, color = "white", icon, value = 0, ...rest }: Props) {
  return (
    <>
      <CardBase w="100%" color="white" bg={color} p={5} {...rest}>
        <HStack display="flex" justifyContent="flex-end">
          {icon}
        </HStack>

        <Text as="b" fontSize="md">
          {title}
        </Text>
        <Text as="b" fontSize="xl">
          {new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(value)}
        </Text>
      </CardBase>
    </>
  );
}
