import { Container, Flex, Heading, HStack, Stack, VStack } from "@chakra-ui/react";

import Box from "@/components/Box";
import Button from "@/components/Button";
import { Input } from "@/components/Input";


export default function Add() {
  return (
    <Container maxW="6xl">
      <Heading as="h4" size="md" mt={5} mb={10}>
        Cadastro
      </Heading>

      <Box>
        <Stack mt={5}>
          <HStack>
            <Input size="md" placeholder="Nome" />
            <Input size="md" placeholder="E-mail" />
          </HStack>
        </Stack>
        <Flex justifyContent="flex-end" mt={5}>
          <Button w="100px" color="primary" size="md" title="Enviar" />
        </Flex>
      </Box>
    </Container>
  );
}
