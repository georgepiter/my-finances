import { useState } from "react";

import {
  Card,
  CardBody,
  Container,
  Divider,
  Stack,
  Text,
  Switch,
  useColorMode,
  VStack,
  FormControl,
  FormLabel,
  HStack,
  Box,
} from "@chakra-ui/react";

import Layout from "@/components/template/Layout";

export default function Settings() {
  const { toggleColorMode, colorMode } = useColorMode();
  const [isDarkMode, setIsDarkMode] = useState(() =>
    colorMode === "dark" ? true : false
  );


  function handleThemeColor() {
    setIsDarkMode((prev) => !prev);
    toggleColorMode();
  }
  return (
    <>
      <Layout>
        <Box
          bgGradient={
            colorMode == "dark"
              ? "linear(to-l, primary.600, primary.700)"
              : "linear(to-l, primary.400, primary.500)"
          }
          w="100%"
          h="250px"
        >
          <Container
            display="flex"
            justifyContent="center"
            style={{
              height: "auto",
            }}
          >
            <Container
              w="100%"
              maxW="2xl"
              display="flex"
              justifyContent="center"
              style={{ position: "absolute", marginTop: "100px" }}
            >
              <VStack w="100%">
                <Text fontSize="2xl" as="b" mb={2} color="gray.50">
                  Configurações
                </Text>

                <Card w="100%">
                  <CardBody>
                    <Stack>
                      <Text fontSize="xl" as="b">
                        Gerais
                      </Text>
                      <Divider />

                      <FormControl>
                        <HStack
                          flex={1}
                          justifyContent="space-between"
                          w="100%"
                        >
                          <FormLabel htmlFor="isChecked">Tema Dark:</FormLabel>
                          <Switch
                            id="isChecked"
                            color="primary"
                            isChecked={isDarkMode}
                            onChange={handleThemeColor}
                          />
                        </HStack>
                      </FormControl>
                    </Stack>
                  </CardBody>
                </Card>
              </VStack>
            </Container>
          </Container>
        </Box>
      </Layout>
    </>
  );
}
