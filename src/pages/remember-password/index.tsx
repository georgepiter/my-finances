import { Container, Stack, Text, useToast } from "@chakra-ui/react";

import { FiMail } from "react-icons/fi";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import MaskedInput from "react-text-mask";
import emailMask from "text-mask-addons/dist/emailMask";

import PanelRightBrand from "@/components/template/PanelRightBrand";
import { Input } from "@/components/Input";
import Button from "@/components/Button";
import { forgotUser } from "@/services/user";
import { UserModel } from "@/models/user";

const forgotFormSchema = z.object({
  email: z
    .string({
      required_error: "Digite o E-mail",
    })
});

type FormDataProps = z.infer<typeof forgotFormSchema>;

export default function RememberPassword() {
  const toast = useToast();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataProps>({
    resolver: zodResolver(forgotFormSchema),
  });


  async function handleForgot(data: FormDataProps) {
    try {

      const register = {
        email: data.email
      } as UserModel;

      const res = await forgotUser(register);
      if (res.status === 200) {
        toast({
          title: `E-mail enviado para ${data.email} com sucesso.`,
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
    <>
      <PanelRightBrand>
        <Container p={15}>
          <Stack spacing={4} alignItems="center" mt={150}>
            <Text as="b" fontSize="4xl" mb={10}>
              Esqueceu a senha?
            </Text>

            <form onSubmit={handleSubmit(handleForgot)}>
              <Stack spacing={4} w="100%">
                <Text mb={10} fontSize="md">
                  Não se lembra da senha? Nós te ajudamos.
                </Text>

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      control={control}
                      size="lg"
                      placeholder="E-mail"
                      iconLeft={<FiMail />}
                      errorMessage={errors.email?.message}
                      onChange={onChange}
                      as={MaskedInput}
                      mask={emailMask}
                    />
                  )}
                />

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
      </PanelRightBrand>
    </>
  );
}
