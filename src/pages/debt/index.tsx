import { useEffect, useRef, useState } from "react";

import {
  Container,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button as ButtonBase,
  useDisclosure,
  useToast,
  MenuList,
  MenuItem,
  Text,
  Tag,
  Card,
  CardHeader,
  CardBody,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Center,
  useColorMode,
  Skeleton,
  IconButton as IconButtonBase,
} from "@chakra-ui/react";
import { GiPayMoney } from "react-icons/gi";
import FileBase64 from "react-file-base64";

import { getSession } from "next-auth/react";

import {
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiEdit
} from "react-icons/fi";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";
import Link from "next/link";

import MaskedInput from "react-text-mask";
import { realMask } from "@/utils/mask/realMask";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import IconButton from "@/components/IconButton";
import Box from "@/components/Box";
import Spinner from "@/components/Spinner";
import Layout from "@/components/template/Layout";
import { DebtDTO, DebtValuesDTO } from "@/dto/http/DebtDTO";

import {
  createDebt,
  deleteDebt,
  getAllRegisterByRegister,
  getDebtById,
  updateDebt,
  updateDebtPay,
} from "@/services/debt";
import { listAllCategory } from "@/services/category";
import {
  addOthersByRegisterId,
  getRegisterByUserId,
} from "@/services/register";

import { DebtModel, DebtPayModel } from "@/models/debt";
import { RegisterDTO } from "@/dto/http/RegisterDTO";
import Alert from "@/components/Alert";
import { useRegister } from "@/hooks/useRegister";
import { RegisterProps } from "@/contexts/RegisterContext";
import { addCentsMarkCurrency } from "@/utils/addCentsMarkCurrency";

const insertFormSchema = z.object({
  debtDescription: z.string({
    required_error: "Digite a Descrição",
  }),
  value: z.string({
    required_error: "Digite o Valor",
  }),
  categoryId: z.string({
    required_error: "Digite a Categoria",
  }),
  dueDate: z.string({
    required_error: "Digite a Data",
  }),
});

type FormDataProps = z.infer<typeof insertFormSchema>;

interface SelectProps {
  value: number;
  description: string;
}

interface FileProps {
  name: string;
  type: string;
  size: string;
  base64: string;
}

export default function Debt() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [debts, setDebts] = useState<DebtDTO[]>([]);
  const toast = useToast();

  const { colorMode } = useColorMode();

  const { registerBase, setRegister } = useRegister();

  const [userId, setUserId] = useState(Number);

  const [isEdit, setIsEdit] = useState(false);
  const [debtId, setDebtId] = useState<number>(0);

  const [debt, setDebt] = useState<DebtDTO>({} as DebtDTO);
  const [debtValue, setDebtValue] = useState<DebtValuesDTO>(
    {} as DebtValuesDTO
  );

  const [categories, setCategories] = useState<SelectProps[]>([]);
  const [fileRegister, setFileRegister] = useState<FileProps>({} as FileProps);

  const [isEditOthers, setIsEditOthers] = useState(false);
  const [editOthers, setEditOthers] = useState("");

  const [isSubmittingEditOthers, setIsSubmittingEditOthers] = useState(false);

  const cancelRef = useRef<HTMLInputElement>(null);
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

  const {
    isOpen: isOpenPay,
    onOpen: onOpenPay,
    onClose: onClosePay,
  } = useDisclosure();

  function handleInsertDebt() {
    setIsEdit(false);
    setDebt({} as DebtDTO);
    onOpenFormModal();
  }

  function handleFile(files: any) {
    if (files[0].file.size > 3000000) {
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

  async function handleForm(data: FormDataProps) {
    try {
      let res: any;

       if (isEdit) {
        const dataDebt = {
          userId: userId,
          dueDate: data.dueDate,
          registerId: registerBase.registerId,
          value: Number(
            data.value.replace("R$", "").replace(".", "").replace(",", ".")
          ),
          categoryId: Number(data.categoryId),
          debtDescription: data.debtDescription,
          debtId: debtId,
          status: debt.status,
          paymentDate: debt.paymentDate,
          receiptPayment: fileRegister.base64
            ? fileRegister.base64
                .replace("data:image/jpeg;base64,", "")
                .replace("data:application/pdf;base64,", "")
                .replace("data:image/png;base64,", "")
            : "",
        } as DebtModel;
        res = await updateDebt(dataDebt);
       } else {
        const dataDebt = {
          userId: userId,
          dueDate: data.dueDate,
          registerId: registerBase.registerId,
          value: Number(
            data.value.replace("R$", "").replace(".", "").replace(",", ".")
          ),
          categoryId: Number(data.categoryId),
          debtDescription: data.debtDescription,
        } as DebtModel;

        res = await createDebt(dataDebt);
       }

      if (res.status === 200) {
        toast({
          title: isEdit? "Débito Atualizado com sucesso" : res.data.message,
          status: "success",
          isClosable: true,
        });

        onCloseFormModal();

        loadDebts(registerBase.registerId, userId);
      }

    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleFormPay(event: any) {
    event.preventDefault();
    try {
      const dataDebt = {
        registerId: registerBase.registerId,
        debtId: debtId,
        receiptPayment: fileRegister.base64
          ? fileRegister.base64
              .replace("data:image/jpeg;base64,", "")
              .replace("data:application/pdf;base64,", "")
              .replace("data:image/png;base64,", "")
          : "",
      } as DebtPayModel;

      const res = await updateDebtPay(dataDebt);

      if (res.status === 200) {
        toast({
          title: "Pagamento realizado com sucesso.",
          status: "success",
          isClosable: true,
        });

        onClosePay();
        loadDebts(registerBase.registerId, userId);

      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  async function loadCategories() {
    try {
      const res = await listAllCategory();
      if (res.status === 200) {
        
        const select = renameSelect(res.data);
        setCategories(select);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  function renameSelect(data: any) {
    data = data.map(function (obj: any) {
      obj["value"] = obj["categoryId"]; // Assign new key
      delete obj["categoryId"]; // Delete old key
      return obj;
    });
    return data;
  }

  async function loadDebts(registerId: number, userId: number) {
    setIsLoading(true);
    try {
      const res = await getAllRegisterByRegister(registerId, userId);

      if (res.status == 200) {
        setDebts(res.data.debtList);
        setDebtValue(res.data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadRegister(userId: number) {
    try {
      const res = await getRegisterByUserId(userId);
      const register = res.data as RegisterDTO;

      if (register) {
        const registerBase = {
          registerId: register.registerId,
          salary: Number(register.salary),
          others: Number(register.others),
        } as RegisterProps;
        setRegister(registerBase);

        loadDebts(registerBase.registerId, userId);
      }

    } catch (error: any) {
      console.log(error);
    }
  }

  async function handlePay(debtId: number | undefined) {
    onOpenPay();

    setFileRegister({} as FileProps);

    if (!debtId) return null;
    setDebtId(debtId);
  }

  async function handleEdit(debtId: number | undefined) {
    if (!debtId)
      return null;

    setIsEdit(true);
    setDebtId(debtId);

    try {
      const res = await getDebtById(debtId);
      if (res.status === 200) {
        setDebt(res.data as DebtDTO);

        setFileRegister({
          base64: "data:image/jpeg;base64," + res.data.receiptPayment,
        } as FileProps);

        onOpenFormModal();
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  function handleUpdateRegister () {
    router.push({
      pathname: `/register/${registerBase.registerId}`,
    });
  }

  function handleConfirm(debtId: number | undefined) {
    if (!debtId) return null;

    setDebtId(debtId);

    onOpenConfirm();
  }

  function handleReceiptPayment(debtId: string) {
    router.push({
      pathname: `/receipt-payment/${debtId}`,
    });

   // window.open(`/receipt-payment/${debtId}`);
  }

  async function handleDelete() {
    try {
      const res = await deleteDebt(debtId);

      if (res.status === 200) {
        toast({
          title: res.data.message,
          status: "success",
          isClosable: true,
        });         
        onCloseConfirm();
        loadDebts(registerBase.registerId, userId);
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  function handleUpdateEditOthers() {
    setIsEditOthers(true);
  }

  async function handleFormEditOthers() {

    setIsSubmittingEditOthers(true);

    if (editOthers) {
      setIsEditOthers(false);

      try {
        const others = Number(
          editOthers.replace("R$", "").replace(".", "").replace(",", ".")
        );

        const res = await addOthersByRegisterId(userId, others);
        if (res.status === 200) {
          toast({
            title: "Valor adicionado com sucesso.",
            status: "success",
            isClosable: true,
          });
          loadRegister(userId);
        }
      } catch (error: any) {
        toast({
          title: error.message,
          status: "error",
          isClosable: true,
        });
      } finally  {
        setEditOthers("");
         setIsSubmittingEditOthers(false);
      }
    } else {
      toast({
        title: "O campo Outros valores é obrigatório",
        status: "warning",
        isClosable: true,
      });
      setIsSubmittingEditOthers(false);
    }
  }


  function handleEditOthers(e: React.ChangeEvent<HTMLInputElement>) {
    setEditOthers(addCentsMarkCurrency(e.target.value));
  }

  async function loadSession() {
    const session = await getSession();
    if (session?.user.id) {
      setUserId(session.user.id);
    }
  }

  useEffect(() => {
    loadSession();
    loadCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userId) {
      loadDebts(registerBase.registerId, userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    debt.value = debt.value != undefined ? debt.value.toString() : undefined;
    debt.categoryId =
      debt.categoryId != undefined ? debt.categoryId.toString() : undefined;

    reset(debt);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debt]);

  return (
    <Layout>
      <Container maxW="6xl" mt={10}>
        <Card mb={5}>
          <CardHeader>
            <Heading size="md">
              <Flex justifyContent="space-between">
                Registro
                {registerBase.registerId && (
                  <IconButton
                    size="md"
                    rounded={20}
                    boxShadow="md"
                    colorScheme="blue"
                    bgColor="primary.600"
                    color="white"
                    aria-label="Insert Debt"
                    onClick={handleUpdateRegister}
                    icon={<FiEdit2 />}
                  />
                )}
              </Flex>
            </Heading>
          </CardHeader>
          <CardBody>
            <Stack>
              <HStack justifyContent="space-between" mb={5}>
                <Text as="b" fontSize="lg">
                  Salário:{" "}
                  <Skeleton isLoaded={registerBase.salary != null} w="100%">
                    {new Intl.NumberFormat("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(registerBase.salary))}
                  </Skeleton>
                </Text>

                {isEditOthers ? (
                  <HStack>
                    <Text as="b" fontSize="lg">
                      Outros valores:{"  "}
                    </Text>
                    <form>
                      <Input
                        size="sm"
                        placeholder="Outros Valores"
                        as={MaskedInput}
                        mask={realMask}
                        value={editOthers}
                        onChange={handleEditOthers}
                      />
                    </form>

                    <IconButton
                      size="sm"
                      rounded={20}
                      boxShadow="md"
                      colorScheme="blue"
                      aria-label="Update Others"
                      onClick={handleFormEditOthers}
                      icon={<FiPlus />}
                    />
                  </HStack>
                ) : (
                  <HStack>
                    <Button
                      size="sm"
                      rightIcon={<FiPlus />}
                      colorScheme="blue"
                      onClick={handleUpdateEditOthers}
                      title="Adicionar Outros Valores"
                      isLoading={isSubmittingEditOthers}
                    />
                  </HStack>
                )}
              </HStack>

              <StatGroup>
                <Stat>
                  <StatLabel>Entradas</StatLabel>
                  <StatNumber>
                    <Skeleton
                      isLoaded={debtValue.totalEntryValue != null}
                      w="90%"
                    >
                      {new Intl.NumberFormat("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(debtValue.totalEntryValue))}
                    </Skeleton>
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Entrada
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Saídas</StatLabel>
                  <StatNumber>
                    <Skeleton isLoaded={debtValue.totalDebt != null} w="90%">
                      {new Intl.NumberFormat("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(debtValue.totalDebt))}
                    </Skeleton>
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="decrease" />
                    Saída
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Saldo</StatLabel>
                  <StatNumber>
                    <Skeleton
                      isLoaded={debtValue.currentTotalValue != null}
                      w="90%"
                    >
                      {new Intl.NumberFormat("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(debtValue.currentTotalValue))}
                    </Skeleton>
                  </StatNumber>
                  <StatHelpText>Saldo Atual</StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Total outros valores</StatLabel>
                  <StatNumber>
                    <Skeleton isLoaded={registerBase.others != null} w="90%">
                      {new Intl.NumberFormat("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(registerBase.others))}
                    </Skeleton>
                  </StatNumber>
                  <StatHelpText>Total outros valores</StatHelpText>
                </Stat>
              </StatGroup>
            </Stack>
          </CardBody>
        </Card>

        {/* LIST DEBTS */}
        <Box>
          <HStack display="flex" justifyContent="space-between">
            <Heading as="h4" size="md">
              Débitos
            </Heading>
            <Heading as="h4" size="md" mb={10}>
              <IconButton
                size="md"
                rounded={25}
                boxShadow="md"
                colorScheme="blue"
                aria-label="Insert Debt"
                onClick={handleInsertDebt}
                icon={<FiPlus />}
              />
            </Heading>
          </HStack>
          {isLoading ? (
            <Spinner />
          ) : debts.length === 0 ? (
            <Text>Nenhum registro encontrado.</Text>
          ) : (
            <TableContainer mt={5}>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Descrição</Th>
                    <Th>Valor</Th>
                    <Th>Data Vencimento</Th>
                    <Th>Data Pagamento</Th>
                    <Th textAlign="center">Comprovante</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {debts.map((debt) => (
                    <Tr key={debt.debtId}>
                      <Td>{debt.debtDescription}</Td>
                      <Td>
                        {new Intl.NumberFormat("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(debt.value))}
                      </Td>
                      <Td>{new Date(debt.dueDate).toLocaleDateString()}</Td>
                      <Td>
                        {debt.paymentDate
                          ? new Date(debt.paymentDate).toLocaleDateString()
                          : "-"}
                      </Td>
                      <Td>
                        <Center>
                          {debt.receiptPayment &&
                          debt.debtId &&
                          debt.status === "Pago" ? (
                            <Link
                              href={{
                                pathname: `/receipt-payment/${debt.debtId}`,
                              }}
                              legacyBehavior
                            >
                              <a target="_blank">
                                <FiDownload />
                              </a>
                            </Link>
                          ) : (
                            "-"
                          )}
                        </Center>
                      </Td>
                      <Td>
                        <Tag
                          variant="solid"
                          colorScheme={
                            debt.status == "Aguardando Pagamento"
                              ? "orange"
                              : "green"
                          }
                        >
                          {debt.status}
                        </Tag>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            rounded={20}
                            bg={colorMode == "dark" ? "gray.500" : "gray.50"}
                            as={IconButtonBase}
                            icon={<HamburgerIcon />}
                          />
                          <MenuList minWidth="150px">
                            <MenuItem onClick={() => handleEdit(debt.debtId)}>
                              <HStack flex={1} justifyContent="space-between">
                                <Text>Editar</Text>
                                <FiEdit2 />
                              </HStack>
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleConfirm(debt.debtId)}
                            >
                              <HStack flex={1} justifyContent="space-between">
                                <Text>Excluir</Text>
                                <FiTrash2 />
                              </HStack>
                            </MenuItem>

                            {debt.status !== "Pago" && (
                              <MenuItem onClick={() => handlePay(debt.debtId)}>
                                <HStack flex={1} justifyContent="space-between">
                                  <Text>Pagar</Text>
                                  <GiPayMoney />
                                </HStack>
                              </MenuItem>
                            )}
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
        {/* LIST DEBTS */}

        {/* INSERT DEBTS */}
        <Modal
          isCentered
          onClose={onCloseFormModal}
          isOpen={isOpenFormModal}
          motionPreset="slideInBottom"
          size="md"
        >
          <ModalOverlay />
          <ModalContent maxW="50%">
            <ModalHeader>{isEdit ? "Edição" : "Cadastro"}</ModalHeader>

            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit(handleForm)}>
                <Stack spacing={4} w="100%">
                  <Controller
                    control={control}
                    name="debtDescription"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        size="md"
                        placeholder="Descrição"
                        errorMessage={errors.debtDescription?.message}
                        onChange={onChange}
                        value={value || ""}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="dueDate"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        size="md"
                        type="date"
                        placeholder="Data"
                        errorMessage={errors.dueDate?.message}
                        onChange={onChange}
                        value={value || ""}
                      />
                    )}
                  />

                  <HStack w="100%" mb={5}>
                    <Controller
                      control={control}
                      name="value"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          size="md"
                          placeholder="Valor"
                          errorMessage={errors.value?.message}
                          onChange={onChange}
                          as={MaskedInput}
                          mask={realMask}
                          value={addCentsMarkCurrency(value) || ""}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="categoryId"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          placeholder="Selecione a Categoria"
                          options={categories}
                          errorMessage={errors.categoryId?.message}
                          onChange={onChange}
                          value={value || ""}
                        />
                      )}
                    />
                  </HStack>

                  {isEdit && (
                    <>
                      <Center>
                        {debt.receiptPayment ? (
                          <Text as="b" color="green.600">
                            Comprovante anexado.
                          </Text>
                        ) : (
                          <Text as="b" color="red.600">
                            Comprovante ainda não anexado.
                          </Text>
                        )}
                      </Center>
                      <FileBase64 multiple={true} onDone={handleFile} />
                    </>
                  )}
                </Stack>

                <Flex justifyContent="flex-end" mt={5}>
                  <Button
                    w={90}
                    title="Enviar"
                    type="submit"
                    isLoading={isSubmitting}
                  />
                </Flex>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* INSERT DEBTS */}

        {/* INSERT DEBTS */}
        <Modal
          isCentered
          onClose={onClosePay}
          isOpen={isOpenPay}
          motionPreset="slideInBottom"
          size="md"
        >
          <ModalOverlay />
          <ModalContent maxW="50%">
            <ModalHeader>Pagamento</ModalHeader>

            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleFormPay}>
                <FileBase64 multiple={true} onDone={handleFile} />

                <Flex justifyContent="flex-end" mt={5}>
                  <Button
                    w={90}
                    title="Pagar"
                    type="submit"
                    isLoading={isSubmitting}
                  />
                </Flex>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Alert
          title="Deletar Débito"
          description="Você tem certeza que deseja excluir esse débito?"
          buttonTitle="Deletar"
          isOpen={isOpenConfirm}
          onOpen={onOpenConfirm}
          onClose={onCloseConfirm}
          onClick={handleDelete}
          cancelRef={cancelRef}
        />
      </Container>
    </Layout>
  );
}
