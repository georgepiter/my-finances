

import {
  Container,
  useToast,
  HStack,
  Spacer,
  Stack,
  Text,
  Show,
} from "@chakra-ui/react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import MaskedInput from "react-text-mask";
import emailMask from "text-mask-addons/dist/emailMask";

import { Input } from "@/components/Input";
import PanelLeftBrand from "@/components/template/PanelLeftBrand";
import Button from "@/components/Button";
import { createUser } from "@/services/user";
import { UserModel } from "@/models/user";

const signUpFormSchema = z
  .object({
    name: z.string({
      required_error: "Digite o Nome",
    }),
    email: z
      .string({
        required_error: "Digite o E-mail",
      })
      .email({ message: "E-mail inválido." })
      .trim(),
    password: z
      .string({
        required_error: "Digite a Senha",
      })
      .min(3, { message: "A senha precisa ter pelo menos 3 dígitos." }),
    confirmPassword: z.string({
      required_error: "Digite a Confirmação de Senha.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  }); 

type FormDataProps = z.infer<typeof signUpFormSchema>;

export default function SignUp() {
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataProps>({
    resolver: zodResolver(signUpFormSchema),
  });

  async function handleSignUp(data: FormDataProps) {
    try {
      const user: UserModel = {
        email: data.email,
        name: data.name,
        password: data.password,
      };

      const res = await createUser(user);

      console.log("res", res);

      if (res.status === 201) {
        toast({
          title: res.data.message,
          status: "success",
          isClosable: true,
        });
      } else {
        toast({
          title: res.data.message,
          status: "error",
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
    <>
      <PanelLeftBrand>
        <Container p={15}>
          <Stack spacing={4} alignItems="center" mt={100}>
            <Show below="md">
              <Text as="b" fontSize="4xl" mb={5}>
                Finances
              </Text>
            </Show>
            <Text as="b" fontSize="3xl" mb={10}>
              Cadastro
            </Text>

            <form onSubmit={handleSubmit(handleSignUp)}>
              <Stack spacing={4} w="100%">
                <Text mb={10} fontSize="md">
                  Preencha os dados abaixo para se cadastrar.
                </Text>

                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      size="lg"
                      placeholder="Nome"
                      errorMessage={errors.name?.message}
                      onChange={onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      size="lg"
                      placeholder="E-mail"
                      errorMessage={errors.email?.message}
                      onChange={onChange}
                      as={MaskedInput}
                      mask={emailMask}
                    />
                  )}
                />

                <Spacer />
                <HStack w="100%" mb={5}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        size="lg"
                        type="password"
                        placeholder="Senha"
                        errorMessage={errors.password?.message}
                        onChange={onChange}
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
                      />
                    )}
                  />
                </HStack>

                <Button
                  color="primary"
                  size="lg"
                  title="Enviar"
                  type="submit"
                  isLoading={isSubmitting}
                />
              </Stack>
            </form>
          </Stack>
        </Container>
      </PanelLeftBrand>
    </>
  );
}
