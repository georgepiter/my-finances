import Layout from "@/components/template/Layout";
import {
  Image as ImageBase,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  HStack,
  Stack,
  useColorMode,
  useToast,
  VStack,
  Text,
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
import { useSession } from "next-auth/react";

import avatarDarkImage from "../../assets/_dark/avatar.png";
import avatarlightImage from "../../assets/_light/avatar.png";


import { Input } from "@/components/Input";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { getRegisterById, updateRegister } from "@/services/register";
import { RegisterDTO } from "@/dto/http/RegisterDTO";
import { RegisterModel } from "@/models/register";
import Spinner from "@/components/Spinner";
import { useProfile } from "@/hooks/useProfile";
import { useRegister } from "@/hooks/useRegister";
import { RegisterProps } from "@/contexts/RegisterContext";
import { addCentsMarkCurrency } from "@/utils/addCentsMarkCurrency";

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

  const { registerBase, setRegister } = useRegister();

  const { query, push } = useRouter();
  const registerId = Number(query.id);

  const { colorMode } = useColorMode();
  const { data: session } = useSession();

  const { setProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);


  const [fileRegister, setFileRegister] = useState<FileProps>(
    {} as FileProps
  );

  const [registerLoad, setRegisterLoad] = useState<RegisterDTO>({} as RegisterDTO);

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
        setProfile({
          user: {
            photo: fileRegister.base64
              .replace("data:image/jpeg;base64,", "")
              .replace("data:image/png;base64,", ""),
          },
        });

        const registerBaseNew = {
          registerId: register.registerId,
          salary: Number(register.salary),
          others: Number(register.others),
        } as RegisterProps;
        setRegister(registerBaseNew);

        push({
          pathname: "/debt",
        });

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
    if ((files[0].file.size > 3000000)) {
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

  async function loadRegister(id: number) {
     setIsLoading(true);
    try {
      const res = await getRegisterById(id);
      const registerNew = res.data as RegisterDTO;
      setRegisterLoad(registerNew);

      setFileRegister({
        base64: "data:image/jpeg;base64," + registerNew.photo,
      } as FileProps);

    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (registerId) loadRegister(registerId);
  }, [registerId]);


  useEffect(() => {
    registerLoad.others =
      registerLoad.others != undefined
        ? new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(Number(registerLoad.others))
        : undefined;

    registerLoad.salary =
      registerLoad.salary != undefined
        ? new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(Number(registerLoad.salary))
        : undefined;

    reset(registerLoad);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerLoad]);

  return (
    <Layout>
      <Container maxW="6xl" mt={5}>
        {isLoading ? (
          <Spinner />
        ) : (
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

                  <HStack>
                    <Controller
                      control={control}
                      name="cell"
                      render={({ field: { onChange, value } }) => (
                        <VStack w="100%" alignItems="left">
                          <Text as="b">Celular</Text>
                          <Input
                            size="md"
                            placeholder="Celular"
                            errorMessage={errors.cell?.message}
                            onChange={onChange}
                            as={InputMask}
                            mask="(**) *****-****"
                            value={value || ""}
                          />
                        </VStack>
                      )}
                    />
                  </HStack>
                  <HStack>
                    <Controller
                      control={control}
                      name="salary"
                      render={({ field: { onChange, value } }) => (
                        <VStack w="100%" alignItems="left">
                          <Text as="b">Salário</Text>
                          <Input
                            size="md"
                            placeholder="Salário"
                            errorMessage={errors.salary?.message}
                            onChange={onChange}
                            as={MaskedInput}
                            mask={realMask}
                            value={addCentsMarkCurrency(value) || ""}
                          />
                        </VStack>
                      )}
                    />
                    <Controller
                      control={control}
                      name="others"
                      render={({ field: { onChange, value } }) => (
                        <VStack w="100%" alignItems="left">
                          <Text as="b">Outros Valores</Text>
                          <Input
                            size="md"
                            placeholder="Outros Valores"
                            errorMessage={errors.others?.message}
                            onChange={onChange}
                            as={MaskedInput}
                            mask={realMask}
                            value={addCentsMarkCurrency(value) || ""}
                          />
                        </VStack>
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
        )}
      </Container>
    </Layout>
  );
}
