import {
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Button as ButtonBase,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import MaskedInput from "react-text-mask";
import emailMask from "text-mask-addons/dist/emailMask";

import { FiEdit2, FiPlus, FiTrash2, FiEyeOff, FiEye } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import Button from "@/components/Button";
import { Input } from "@/components/Input";
import { UserModel } from "@/models/user";
import Spinner from "@/components/Spinner";
import Layout from "@/components/template/Layout";
import Box from "@/components/Box";

import { UserDTO } from "@/dto/http/UserDTO";

import { createUser, listAllUser, deleteUser, updateStatusUser } from "@/services/user";
import { UserStatusDTO } from "@/dto/http/UserStatusDTO";

const insertFormSchema = z
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

type FormDataProps = z.infer<typeof insertFormSchema>;

export default function User() {
  const router = useRouter();
  const toast = useToast();

  const [ users, setUsers ] = useState<UserDTO[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);

  const [userId, setUserId] = useState<number>(0);

  const [titleConfirm, setTitleConfirm] = useState("");
  const [descriptionConfirm, setDescriptionConfirm] = useState("");

  const [functionConfirm, setFunctionConfirm] = useState("");

  const [statusUser, setStatusUser] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataProps>({
    resolver: zodResolver(insertFormSchema),
  });

  const {
    isOpen: isOpenFormModal,
    onOpen: onOpenFormModal,
    onClose: onCloseFormModal,
  } = useDisclosure();

  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();

  const cancelRef = useRef<HTMLInputElement>(null);

  function handleInsertUser() {
    onOpenFormModal();
  }

  async function loadUsers () {
    setIsLoading(true);
    try {
      const res = await listAllUser();
      if (res.data) {
        setUsers(res.data as UserDTO[]);        
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirmUser(userId: number, del: boolean = false, status?: string) {
    if (del) {
      setTitleConfirm("Deletar Usuário");
      setDescriptionConfirm(
        "Você tem certeza que deseja excluir esse usuário?"
      );

      setFunctionConfirm("delete");
    } else {
      setTitleConfirm("Ativar/Inativar Usuário");
      setDescriptionConfirm(
        "Você tem certeza que deseja alterar o status desse usuário?"
      );
      setFunctionConfirm("status");

      if (status)
        setStatusUser(status);
    }

    setUserId(userId);

    onOpenConfirm();
  }

  async function handleDeleteUser() {
     try {
      const res = await deleteUser(userId);

      if (res.status === 200) {
        toast({
          title: res.data.message,
          status: "success",
          isClosable: true,
        });

        onCloseConfirm();
        loadUsers();
      }

     } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
     }
  }

  async function handleStatusUser() {
    try {
      const userStatus: UserStatusDTO = {
        userId: userId,
        status: statusUser == "ACTIVE" ? "INACTIVE" : "ACTIVE",
      };

      const res = await updateStatusUser(userStatus);
      if (res.status === 200) {
        toast({
          title: `Usuário ${
            statusUser === "ACTIVE" ? "inativado" : "ativado"
          } com sucesso.`,
          status: statusUser === "ACTIVE" ? "warning" : "success",
          isClosable: true,
        });

        onCloseConfirm();
        loadUsers();
      }

    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  async function handleEditUser(userId: number) {

    console.log(userId);
  }

  async function handleForm(data: FormDataProps) {
     try {
       const user: UserModel = {
         email: data.email,
         name: data.name,
         password: data.password,
         roleId: 2,
       };

       const res = await createUser(user);
       if (res.status === 200) {
         toast({
           title: res.data.message,
           status: "success",
           isClosable: true,
         });

        reset();
        onCloseFormModal();
        loadUsers();
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

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Layout>
      {/* LIST USERS */}
      <Container maxW="6xl">
        <Heading as="h4" size="md" mb={5}>
          Usuários
        </Heading>

        <Box>
          <HStack display="flex" justifyContent="flex-end">
            <Heading as="h4" size="md" mb={10}>
              <IconButton
                size="md"
                rounded={25}
                boxShadow="md"
                colorScheme="blue"
                aria-label="Insert User"
                onClick={handleInsertUser}
                icon={<FiPlus />}
              />
            </Heading>
          </HStack>

          {isLoading ? (
            <Spinner />
          ) : (
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Nome</Th>
                    <Th>Email</Th>
                    <Th>Perfil</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.userId}>
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.perfil}</Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            bg="gray.50"
                            as={ButtonBase}
                            rightIcon={<ChevronDownIcon />}
                          >
                            Ações
                          </MenuButton>
                          <MenuList>
                            {/* <MenuItem
                              onClick={() => handleEditUser(user.userId)}
                            >
                              <HStack flex={1} justifyContent="space-between">
                                <Text>Editar</Text>
                                <FiEdit2 />
                              </HStack>
                            </MenuItem> */}
                            <MenuItem
                              onClick={() =>
                                handleConfirmUser(user.userId, true)
                              }
                            >
                              <HStack flex={1} justifyContent="space-between">
                                <Text>Excluir</Text>
                                <FiTrash2 />
                              </HStack>
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleConfirmUser(
                                  user.userId,
                                  false,
                                  user.status
                                )
                              }
                            >
                              <HStack flex={1} justifyContent="space-between">
                                <Text>
                                  {user.status === "ACTIVE"
                                    ? "Inativar"
                                    : "Ativar"}
                                </Text>
                                {user.status === "ACTIVE" ? (
                                  <FiEyeOff />
                                ) : (
                                  <FiEye />
                                )}
                              </HStack>
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
      {/* LIST USERS */}

      {/* INSERT USERS */}
      <Modal
        isCentered
        onClose={onCloseFormModal}
        isOpen={isOpenFormModal}
        motionPreset="slideInBottom"
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(handleForm)}>
              <Stack spacing={4} w="100%">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      size="lg"
                      placeholder="Nome"
                      errorMessage={errors.name?.message}
                      onChange={onChange}
                      value={value || ""}
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
                      value={value || ""}
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

                <Flex justifyContent="flex-end">
                  <Button
                    w={90}
                    title="Enviar"
                    type="submit"
                    isLoading={isSubmitting}
                  />
                </Flex>
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      {/* INSERT USERS */}

      <AlertDialog
        isOpen={isOpenConfirm}
        leastDestructiveRef={cancelRef}
        onClose={onCloseConfirm}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {titleConfirm}
            </AlertDialogHeader>

            <AlertDialogBody>{descriptionConfirm}</AlertDialogBody>

            <AlertDialogFooter>
              <ButtonBase onClick={onCloseConfirm}>Cancel</ButtonBase>

              {functionConfirm == "delete" ? (
                <ButtonBase colorScheme="red" onClick={handleDeleteUser} ml={3}>
                  Delete
                </ButtonBase>
              ) : (
                <ButtonBase colorScheme="red" onClick={handleStatusUser} ml={3}>
                  Alterar
                </ButtonBase>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
}
