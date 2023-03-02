import { useEffect, useRef, useState } from "react";
import CardDashboard from "@/components/CardDashboard";
import {
  Container,
  HStack,
  Stack,
  Text,
  useColorMode,
  useTheme,
  Button as ButtonBase,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { MdAttachMoney } from "react-icons/md";
import { FiArrowDownCircle, FiCreditCard, FiTrash2 } from "react-icons/fi";

import { getSession } from "next-auth/react";

import Box from "@/components/Box";
import Layout from "@/components/template/Layout";
import IconButton from "@/components/IconButton";

import { getAllRegisterByUserId } from "@/services/register";
import { deleteHistory, getAllHistoryByRegister } from "@/services/history";
import { getDebtDash } from "@/services/debt";

import { HistoryDTO } from "@/dto/http/HistoryDTO";
import { RegisterDTO } from "@/dto/http/RegisterDTO";
import { DashDTO } from "@/dto/http/DashDTO";

export default function Dashboard() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const theme = useTheme();
  const cancelRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState(Number);

  const [history, setHistory] = useState<HistoryDTO[]>([]);
  const [register, setRegister] = useState<RegisterDTO>({} as RegisterDTO);

  const [dash, setDash] = useState<DashDTO>({} as DashDTO);
  const [financialHistoryId, setFinancialHistoryId] = useState<number>(0);

   const {
     isOpen: isOpenConfirm,
     onOpen: onOpenConfirm,
     onClose: onCloseConfirm,
   } = useDisclosure();

  const dateFormat = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

   const moneyFormat = (value: string) => {
     return new Intl.NumberFormat("pt-br", {
       style: "currency",
       currency: "BRL",
     }).format(Number(value));
   };


  async function loadSession() {
     const session = await getSession();
     if (session?.user.id) {
       setUserId(session.user.id);
     }
  }

  async function loadRegister(userId: number) {
    try {
      const res = await getAllRegisterByUserId(userId);
      const registerRes = res.data as RegisterDTO;

      setRegister(registerRes);

      if (registerRes) {
        loadHistory(registerRes.registerId);
        loadValuesRegister(userId, registerRes.registerId);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function loadValuesRegister(userId: number, registerId: number) {
    try {
      const res = await getDebtDash(userId, registerId);
      const dashRes = res.data as DashDTO;
      setDash(dashRes);
    } catch (error: any) {
      console.log(error);
    }
  }

  async function loadHistory(registerId: number) {
    try {
      const res = await getAllHistoryByRegister(registerId);
      const historyList = res.data.financialList;
      setHistory(historyList);
    } catch (error: any) {
      console.log(error);
    }
  }

  function handleConfirm(id: number) {
    setFinancialHistoryId(id);
    onOpenConfirm();
  }

  async function handleDeleteHistory() {
    try {
      const res = await deleteHistory(register.registerId, financialHistoryId);

      if (res.status === 200) {
        toast({
          title: res.data.message,
          status: "success",
          isClosable: true,
        });

        onCloseConfirm();
        loadHistory(register.registerId);
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
    loadSession();
  }, []);

  useEffect(() => {
    if (userId) loadRegister(userId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <Layout>
      <Container maxW="6xl">
        <HStack p={3} w="100%" spacing={6}>
          <CardDashboard
            color="green.600"
            title="Entrada"
            value={dash.currentTotalValue ? Number(dash.currentTotalValue) : 0}
            isLoaded={dash.currentTotalValue != null}
            icon={<MdAttachMoney size={25} />}
          />

          <CardDashboard
            color="red.600"
            title="Gastos"
            value={dash.totalDebt ? Number(dash.totalDebt) : 0}
            isLoaded={dash.totalDebt != null}
            icon={<FiArrowDownCircle size={25} />}
          />

          <CardDashboard
            color="blue.600"
            title="Saldo"
            value={dash.totalEntryValue ? Number(dash.totalEntryValue) : 0}
            isLoaded={dash.totalEntryValue != null}
            icon={<FiCreditCard size={25} />}
          />
        </HStack>

        <HStack mt={5} spacing={6}>
          <Box title="Histórico">
            {history.length === 0 ? (
              <Text mt={5}>Nenhum registro encontrado.</Text>
            ) : (
              <TableContainer mt={5}>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Período</Th>
                      <Th>Crédito</Th>
                      <Th>Débito</Th>
                      <Th>Saldo</Th>
                      <Th>Deletar</Th>
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
                          }).format(Number(h.totalCredit))}
                        </Td>
                        <Td>
                          -
                          {new Intl.NumberFormat("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(h.totalDebt))}
                        </Td>
                        <Td>
                          {new Intl.NumberFormat("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(h.balanceCredit))}
                        </Td>
                        <Td>
                          {h.financialHistoryId && (
                            <IconButton
                              size="md"
                              rounded={25}
                              boxShadow="md"
                              colorScheme="red"
                              aria-label="Delete History"
                              onClick={() =>
                                handleConfirm(h.financialHistoryId)
                              }
                              icon={<FiTrash2 />}
                            />
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </HStack>

        <HStack mt={5} spacing={6} mb={10}>
          <Box title="Saldo Anual">
            <Stack mt={5} w="100%">
              {history.length === 0 ? (
                <Text mt={5}>Nenhum registro encontrado.</Text>
              ) : (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={history}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" tickFormatter={dateFormat} />
                      <YAxis tickFormatter={moneyFormat} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="balanceCredit"
                        name="Saldo"
                        stroke={theme.colors.primary["500"]}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Stack>
          </Box>
        </HStack>

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
                Você tem certeza que deseja excluir esse histórico?
              </AlertDialogBody>

              <AlertDialogFooter>
                <ButtonBase onClick={onCloseConfirm}>Cancel</ButtonBase>
                <ButtonBase
                  colorScheme="red"
                  onClick={handleDeleteHistory}
                  ml={3}
                >
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
