import { Text, Container, Center } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Container as="footer">
      <Center>
        <Text fontSize="sm" color="subtle">
          &copy; {new Date().getFullYear()} Finances reserved.
        </Text>
      </Center>
    </Container>
  );
}
