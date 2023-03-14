import {
  Container,
  Heading,
  HStack,
  Menu,
  MenuButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button as ButtonBase,
  Text,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  IconButton as IconButtonBase,
  useColorMode,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import Box from "@/components/Box";
import IconButton from "@/components/IconButton";
import Layout from "@/components/template/Layout";
import { useEffect, useRef, useState } from "react";
import { useRegister } from "@/hooks/useRegister";

import { deleteHistory, getAllHistoryByRegister } from "@/services/history";
import Spinner from "@/components/Spinner";
import { HistoryDTO } from "@/dto/http/HistoryDTO";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";

export default function History() {

  const toast = useToast();

  const { colorMode } = useColorMode();

  const [isLoading, setIsLoading] = useState(false);
  const { registerBase } = useRegister();

  const [history, setHistory] = useState<HistoryDTO[]>([]);
  const [historyId, setHistoryId] = useState<number>(0);

  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();

  const cancelRef = useRef<HTMLInputElement>(null);

  async function loadHistory() {
    setIsLoading(true);
    try {
      const res = await getAllHistoryByRegister(registerBase.registerId);
      if (res.status == 200) {
        setHistory(res.data.financialList);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirm(id: number) {
    setHistoryId(id);

    onOpenConfirm();
  }

  async function handleDelete() {
    try {
      const res = await deleteHistory(registerBase.registerId, historyId);

      if (res.status === 200) {
        toast({
          title: res.data.message,
          status: "success",
          isClosable: true,
        });

        onCloseConfirm();
        loadHistory();
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
    if (registerBase.registerId) loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerBase.registerId]);

  return (
    <Layout>
      <Container maxW="6xl" mt={10}>
        <Box>
          <HStack display="flex" justifyContent="space-between">
            <Heading as="h4" size="md">
              Histórico
            </Heading>
          </HStack>

          {isLoading ? (
            <Spinner />
          ) : history.length === 0 ? (
            <Text mt={4}>Nenhum registro encontrado.</Text>
          ) : (
            <TableContainer mt={5}>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Período</Th>
                    <Th>Entradas</Th>
                    <Th>Débito</Th>
                    <Th>Saldo</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {history.map((h) => (
                    <Tr key={h.financialHistoryId}>
                      <Td>{h.period}</Td>
                      <Td>
                        {new Intl.NumberFormat("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(h.balanceCredit))}
                      </Td>
                      <Td>
                        {new Intl.NumberFormat("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(h.totalDebt))}
                      </Td>
                      <Td>
                        {new Intl.NumberFormat("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(h.totalCredit))}
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
                            <MenuItem
                              onClick={() =>
                                handleConfirm(h.financialHistoryId)
                              }
                            >
                              <HStack flex={1} justifyContent="space-between">
                                <Text>Excluir</Text>
                                <FiTrash2 />
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

        <AlertDialog
          isOpen={isOpenConfirm}
          leastDestructiveRef={cancelRef}
          onClose={onCloseConfirm}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Deletar Histórico
              </AlertDialogHeader>

              <AlertDialogBody>
                Você tem certeza que deseja deletar o(s) histórico(s)?
              </AlertDialogBody>

              <AlertDialogFooter>
                <ButtonBase onClick={onCloseConfirm}>Cancel</ButtonBase>
                <ButtonBase colorScheme="red" onClick={handleDelete} ml={3}>
                  Delete
                </ButtonBase>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </Layout>
  );
}
