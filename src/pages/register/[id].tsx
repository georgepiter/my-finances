import Layout from "@/components/template/Layout";
import {
  Image as ImageBase,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import FileBase64 from "react-file-base64";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

import InputMask from "react-input-mask";
import MaskedInput from "react-text-mask";
import { realMask } from "@/utils/mask/realMask";

import avatarDarkImage from "../../assets/_dark/avatar.png";
import avatarlightImage from "../../assets/_light/avatar.png";


import { Input } from "@/components/Input";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { getRegisterById, updateRegister } from "@/services/register";
import { RegisterDTO } from "@/dto/http/RegisterDTO";
import { RegisterModel } from "@/models/register";
import { useSession } from "next-auth/react";

interface FileProps {
  name?: string;
  type?: string;
  size?: string;
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

  const { query } = useRouter();
  const registerId = Number(query.id);

  const { colorMode } = useColorMode();
  const { data: session } = useSession();

  const [fileRegister, setFileRegister] = useState<FileProps>(
    {} as FileProps
  );

  const [register, setRegister] = useState<RegisterDTO>({} as RegisterDTO);

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
        registerId: registerId,
        userId: session?.user.id,
        cell: data.cell.replace(/[^0-9]/g, ""),
        others: Number(
          data.others.replace("R$", "").replace(".", "").replace(",", ".")
        ),
        salary: Number(
          data.salary.replace("R$", "").replace(".", "").replace(",", ".")
        ),
        photo: fileRegister.base64
          .replace("data:image/jpeg;base64,", "")
          .replace("data:image/png;base64,", ""),
      } as RegisterModel;

      const res = await updateRegister(register);
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

  function handleFile(files: any) {
    const file = files[0] as FileProps;
    setFileRegister(file);
  }

  async function loadRegister(id: number) {
    try {
      const res = await getRegisterById(id);
      const register = res.data as RegisterDTO;
      setRegister(register);

      setFileRegister({ base64: "data:image/jpeg;base64," + register.photo } as FileProps);
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadRegister(registerId);
  }, [query]);

  useEffect(() => {

    register.others =
      register.others != undefined
        ? new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(Number(register.others))
        : undefined;

    register.salary =
      register.salary != undefined ? 
       new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(Number(register.salary)) : undefined;

     reset(register);
   }, [register]);

  return (
    <Layout>
      <Container maxW="6xl">
        <Heading as="h4" size="sm" mb={5}>
          Registros
        </Heading>

        <Card w="100%">
          <CardBody>
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
                        colorMode == "dark" ? avatarDarkImage : avatarlightImage
                      }
                      width={100}
                      alt="Brand Image"
                    />
                  )}
                </Center>

                <FileBase64 multiple={true} onDone={handleFile} />

                <HStack>
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
                        value={value || ""}
                      />
                    )}
                  />
                </HStack>
                <HStack>
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
                        value={value || ""}
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
                  isLoading={isSubmitting}
                />
              </Flex>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Layout>
  );
}
