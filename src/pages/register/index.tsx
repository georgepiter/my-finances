
import { useState } from "react";
import { Image as ImageBase, Card, CardBody, Container, Divider, Flex, HStack, Stack, Text, useToast, VStack, Center, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import FileBase64 from "react-file-base64";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import InputMask from "react-input-mask";
import MaskedInput from "react-text-mask";

import { Input } from "@/components/Input";
import { realMask } from "@/utils/mask/realMask";
import Button from "@/components/Button";


import useAuth from "@/hooks/useAuth";


import bgImage from "../../assets/bg-top.png";
import avatarDarkImage from "../../assets/_dark/avatar.png";
import avatarlightImage from "../../assets/_light/avatar.png";

import { createRegister } from "@/services/register";
import { RegisterModel } from "@/models/register";

interface FileProps {
  name: string;
  type: string;
  size: string;
  base64: string;
}

const formSchema = z.object({
  cell: z.string({
    required_error: "Digite o Celular",
  }),
  salary: z.string({
    required_error: "Digite o Salário",
  }),
  others: z.string({
    required_error: "Digite Outros Valores",
  }),
});

type FormDataProps = z.infer<typeof formSchema>;

export default function Register() {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { data: session } = useSession();
  const router = useRouter();

  const [fileRegister, setFileRegister] = useState<FileProps>({} as FileProps);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataProps>({
    resolver: zodResolver(formSchema),
  });

  async function handleForm(data: FormDataProps) {
    try {
      const register = {
        userId: session?.user.id,
        cell: data.cell.replace(/[^0-9]/g, ""),
        others: Number(
          data.others.replace("R$", "").replace(".", "").replace(",", ".")
        ),
        salary: Number(
          data.salary.replace("R$", "").replace(".", "").replace(",", ".")
        ),
        photo: fileRegister.base64? fileRegister.base64
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/png;base64,", "") : "",
      } as RegisterModel;

      const res = await createRegister(register);
      if (res.status === 200) {
        toast({
          title: res.data.message,
          status: "success",
          isClosable: true,
        });

        router.push({
          pathname: "/dashboard",
        });
      }

    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  function handleFile(files: any) {
    if (files[0].file.size > 200000) {
      toast({
        title: "O tamanho da imagem é muito grande.",
        status: "warning",
        isClosable: true,
      });
      return null;
    }
    
    const file = files[0] as FileProps;
    setFileRegister(file);
  }

  return (
    <Container h="200px">
      <Image
        style={{ position: "absolute", marginTop: "0px" }}
        src={bgImage}
        fill
        alt="Brand Image"
      />

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
              Primeiro acesso
            </Text>

            <Card w="100%">
              <CardBody>
                <Stack>
                  <Text fontSize="xl" as="b">
                    Registro
                  </Text>
                  <Divider />

                  <form onSubmit={handleSubmit(handleForm)}>
                    <Stack spacing={4} w="100%">
                      <Center>
                        {fileRegister.base64 ? (
                          <ImageBase
                            borderRadius="full"
                            boxSize="100px"
                            src={fileRegister.base64}
                            alt="Photo Register"
                          />
                        ) : (
                          <Image
                            src={
                              colorMode == "dark"
                                ? avatarDarkImage
                                : avatarlightImage
                            }
                            width={100}
                            alt="Brand Image"
                          />
                        )}
                      </Center>

                      <FileBase64 multiple={true} onDone={handleFile} />

                      <Controller
                        control={control}
                        name="cell"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            size="md"
                            placeholder="Celular"
                            errorMessage={errors.cell?.message}
                            onChange={onChange}
                            as={InputMask}
                            mask="(**) *****-****"
                          />
                        )}
                      />

                      <HStack w="100%" mt={5}>
                        <Controller
                          control={control}
                          name="others"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              size="md"
                              placeholder="Outros"
                              errorMessage={errors.others?.message}
                              onChange={onChange}
                              as={MaskedInput}
                              mask={realMask}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="salary"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              size="md"
                              placeholder="Salário"
                              errorMessage={errors.salary?.message}
                              onChange={onChange}
                              as={MaskedInput}
                              mask={realMask}
                            />
                          )}
                        />
                      </HStack>
                    </Stack>
                    <Flex justifyContent="flex-end" mt={5}>
                      <Button
                        w="100px"
                        color="primary"
                        size="md"
                        title="Salvar"
                        type="submit"
                        isLoading={isSubmitting}
                      />
                    </Flex>
                  </form>
                </Stack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Container>
    </Container>
  );
}