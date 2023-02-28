import {
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  HStack,
  Spacer,
  Stack,
  Text,
  useColorMode,
  useToast,
  Image as ImageBase,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";

import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import InputMask from "react-input-mask";
import MaskedInput from "react-text-mask";
import { useEffect, useState } from "react";
import emailMask from "text-mask-addons/dist/emailMask";

import Button from "@/components/Button";
import { Input } from "@/components/Input";
import Layout from "@/components/template/Layout";

import bgImage from "../../assets/bg-top.png";
import avatarDarkImage from "../../assets/_dark/avatar.png";
import avatarlightImage from "../../assets/_light/avatar.png";

import { resetUser } from "@/services/user";
import { getRegisterByUserId } from "@/services/register";

import { UserModel } from "@/models/user";
import { RegisterDTO } from "@/dto/http/RegisterDTO";

import { useProfile } from "@/hooks/useProfile";

const passwordFormSchema = z.object({
  newPassword: z
    .string({ required_error: "Digite a Senha" })
    .min(6, { message: "A senha precisa ter pelo menos 6 dígitos." }),
  confirmPassword: z.string({ required_error: "Digite a Confirmação da Senha" }),
})
  .refine((data) => data.confirmPassword === data.newPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  });

type FormDataProps = z.infer<typeof passwordFormSchema>;

export default function Profile() {
  const { data: session } = useSession();

  const { colorMode } = useColorMode();
  const toast = useToast();

  const { userProfile } = useProfile();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataProps>({
    resolver: zodResolver(passwordFormSchema),
  });


  async function handleProfile(data: FormDataProps) {
    try {
      const user = {
        email: session?.user.email,
        password: data.newPassword
      } as UserModel;


      const res = await resetUser(user);

     if (res.status === 200) {
        toast({
          title: "Registro atualizado com sucesso.",
          status: "success",
          isClosable: true,
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


  return (
    <Layout>
      <Container h="150px">
        <Image
          style={{ position: "absolute", marginTop: "65px" }}
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
          {userProfile.user?.photo ? (
            <ImageBase
              borderRadius="full"
              w={100}
              h={100}
              src={`data:image/jpeg;base64,${userProfile.user.photo}`}
              alt="Photo Register"
              style={{ position: "absolute", marginTop: "5px" }}
            />
          ) : (
            <Image
              src={colorMode == "dark" ? avatarDarkImage : avatarlightImage}
              alt="Avatar Photo"
              width={100}
              height={100}
              style={{ position: "absolute", marginTop: "5px" }}
            />
          )}

          <Container
            w="100%"
            maxW="2xl"
            display="flex"
            justifyContent="center"
            style={{ position: "absolute", marginTop: "100px" }}
          >
            <VStack w="100%">
              <Text fontSize="2xl" as="b" mb={2} color="gray.50">
                {session?.user.name}
              </Text>

              <Card w="100%">
                <CardBody>
                  <form onSubmit={handleSubmit(handleProfile)}>
                    <Stack>
                      <Text fontSize="xl" as="b">
                        Alterar Senha
                      </Text>

                      <Divider />

                      <HStack w="100%" mt={5}>
                        <Controller
                          control={control}
                          name="newPassword"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              type="password"
                              size="md"
                              placeholder="Nova Senha"
                              errorMessage={errors.newPassword?.message}
                              onChange={onChange}
                              value={value || ""}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="confirmPassword"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              type="password"
                              size="lg"
                              placeholder="Confirmar Senha"
                              errorMessage={errors.confirmPassword?.message}
                              onChange={onChange}
                              value={value || ""}
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
                      />
                    </Flex>
                  </form>
                </CardBody>
              </Card>
            </VStack>
          </Container>
        </Container>
      </Container>
    </Layout>
  );
}
