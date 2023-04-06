import { FiUser, FiLock } from "react-icons/fi";

import {
  Container,
  HStack,
  Stack,
  Text,
  Flex,
  Checkbox,
  VStack,
  useToast,
  Show,
  Hide,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import PanelLeftBrand from "@/components/template/PanelLeftBrand";
// import Input from "@/components/Input";
import Link from "@/components/Link";
import Button from "@/components/Button";
import { Input } from "@/components/Input";
import { signIn } from "next-auth/react";

import logo from "../../assets/_dark/logo.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSignInSettings, setSignInSettings, SignInProps } from "@/services/storage/signInStorage";

const signInFormSchema = z.object({
  username: z
    .string({
      required_error: "Digite o Usuário",
    })
    .min(3, { message: "O usuário precisa ter pelo menos 3 letras." })
    .transform((username) => username.toLowerCase()),
  password: z
    .string({
      required_error: "Digite a Senha",
    })
    .min(3, { message: "A senha precisa ter pelo menos 3 dígitos." }),
});

type FormDataProps = z.infer<typeof signInFormSchema>

export default function SignIn() {
  const {
    control,
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataProps>({
    resolver: zodResolver(signInFormSchema),
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const toast = useToast();
  const router = useRouter();

  const [loginForm, setLoginForm] = useState<SignInProps>({} as SignInProps);

  async function handleSignIn(data: FormDataProps) {
    try {
      await setOptions();

      const res = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
        callbackUrl: `${window.location.origin}/`,
      });
      
      if (res?.status !== 200) {
        toast({
          title: res?.error,
          status: "error",
          isClosable: true,
        });
      } else {
        router.push({
          pathname: "/",
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

  function handleSignUp() {
    router.push({
      pathname: "/signUp",
    });
  }

  function handleRememberPassword() {
    router.push({
      pathname: "/remember-password",
    });
  }

  async function setOptions() {
    const options: SignInProps = {
      username: !rememberMe ? "" : getValues("username"),
      password: !rememberMe ? "" : getValues("password"),
      rememberMe: rememberMe,
    };
    await setSignInSettings(options);
  }

  async function  handleRememberMe() {
    setRememberMe((prev) => !prev)
  }

  useEffect(() => {
    async function loadSettings() {
      const configStoraged = await getSignInSettings();

      if (configStoraged) {
        setRememberMe(configStoraged?.rememberMe);
        setPassword(configStoraged?.password);
        setUsername(configStoraged?.username);

        loginForm.rememberMe = configStoraged?.rememberMe;
        loginForm.username = configStoraged?.username;
        loginForm.password = configStoraged?.password;

        reset(loginForm);
      }
    }
    loadSettings();
    
  }, []);

  useEffect(() => {
    async function load() {
      await setOptions();
    }
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rememberMe, username, password]);

  return (
    <>
      <PanelLeftBrand>
        <Container p={20}>
          <Stack spacing={4} alignItems="center" mt={100}>
            <Show below="md">
              <Image
                src={logo}
                alt="Brand Image"
                style={{ height: "auto", width: "95%", marginBottom: "30px" }}
              />
            </Show>

            <Show above="md">
              <Text as="b" fontSize="4xl" mb={10}>
                Login
              </Text>
            </Show>

            <Stack spacing={4} w="100%">
              <form onSubmit={handleSubmit(handleSignIn)}>
                <VStack w="100%">
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        size="lg"
                        placeholder="Usuário"
                        iconLeft={<FiUser />}
                        errorMessage={errors.username?.message}
                        onChange={onChange}
                        value={value || ""}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        control={control}
                        name="password"
                        type="password"
                        size="lg"
                        placeholder="Senha"
                        iconLeft={<FiLock />}
                        errorMessage={errors.password?.message}
                        onChange={onChange}
                        value={value || ""}
                      />
                    )}
                  />
                </VStack>

                <HStack w="100%">
                  <Flex justifyContent="space-between" w="100%">
                    <Checkbox
                      colorScheme="primary"
                      defaultChecked={rememberMe}
                      onChange={handleRememberMe}
                      isChecked={rememberMe}
                    >
                      Lembrar-me
                    </Checkbox>
                    <Link
                      onClick={handleRememberPassword}
                      title="Esqueci minha senha"
                    ></Link>
                  </Flex>
                </HStack>

                <HStack mt={5} w="100%">
                  <Button
                    w="100%"
                    color="primary"
                    size="lg"
                    title="Enviar"
                    type="submit"
                    isLoading={isSubmitting}
                  />
                </HStack>
              </form>
            </Stack>
          </Stack>

          {/* <Stack spacing={2} mt={5}>
            <Text mt={50}>Não tem conta?</Text>
            <Link onClick={handleSignUp} title="Cadastre-se" color="secondary.500"></Link>
          </Stack> */}
        </Container>
      </PanelLeftBrand>
    </>
  );
}
