
import { useEffect, useState, useRef } from "react";

import {
  useToast,
  useDisclosure,
  HStack,
  Stack,
  Text,
  useTheme,
  VStack,
  Heading,
  Center,
  Tag
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiTrash2 } from "react-icons/fi";

import { HistoryDTO } from "@/dto/http/HistoryDTO";
import { deleteHistory, getAllHistoryByRegister } from "@/services/history";
import Alert from "@/components/Alert";
import IconButton from "@/components/IconButton";
import Box from "@/components/Box"; 
import Divider from "@/components/Divider";

import DataTableBase from "../DataTableBase";

interface Props {
  registerId: number;
}

export default function HistoryAllByRegisterTable({ registerId }: Props) {
  const toast = useToast();
  const theme = useTheme();

  const [history, setHistory] = useState<HistoryDTO[]>([]);
  const [financialHistoryId, setFinancialHistoryId] = useState<number>(0);
  const cancelRef = useRef<HTMLInputElement>(null);

  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();

  const columns = [
    {
      name: "Período",
      selector: (row: HistoryDTO) => (
        <Tag size="md" variant="solid" borderRadius="full" bg="primary.700">
          {row.period}
        </Tag>
      ),
    },
    {
      name: "Crédito",
      selector: (row: HistoryDTO) => (
        <Tag size="md" variant="solid" borderRadius="full" colorScheme="green">
          {new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(Number(row.totalDebt))}
        </Tag>
      ),
    },
    {
      name: "Débito",
      selector: (row: HistoryDTO) => (
        <Tag size="md" variant="solid" borderRadius="full" colorScheme="red">
          {new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(Number(row.totalDebt))}
        </Tag>
      ),
    },
    {
      name: "Saldo",
      selector: (row: HistoryDTO) => (
        <Tag size="md" variant="solid" borderRadius="full" colorScheme="blue">
          {new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(Number(row.balanceCredit))}
        </Tag>
      ),
    },
    {
      name: "Deletar",
      selector: (row: HistoryDTO) =>
        row.financialHistoryId && (
          <IconButton
            size="md"
            rounded={25}
            boxShadow="md"
            colorScheme="red"
            aria-label="Delete History"
            onClick={() => handleConfirm(row.financialHistoryId)}
            icon={<FiTrash2 />}
          />
        ),
    },
  ];

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
      const res = await deleteHistory(
        registerId,
        financialHistoryId
      );

      if (res.status === 200) {
        toast({
          title: res.data.message,
          status: "success",
          isClosable: true,
        });

        onCloseConfirm();
        loadHistory(registerId);
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    }
  }

  const dateFormat = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const moneyFormat = (value: string) => {
    return new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
  };


  useEffect(() => {
    loadHistory(registerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box>
        <Heading as="h4" size="md">
          Histórico
        </Heading>
        <Divider mt={2} />
        <DataTableBase columns={columns} data={history} title="" />
      </Box>

      <HStack mt={5} spacing={6} mb={10}>
        <Box title="Saldo Anual">
          <Divider mt={2} />
          <Stack mt={5} w="100%">
            {history.length === 0 ? (
              <Center>
                <Text>Nenhum registro encontrado.</Text>
              </Center>
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

      <Alert
        title="Deletar Histórico"
        description="Você tem certeza que deseja excluir esse histórico?"
        buttonTitle="Deletar"
        isOpen={isOpenConfirm}
        onOpen={onOpenConfirm}
        onClose={onCloseConfirm}
        onClick={handleDeleteHistory}
        cancelRef={cancelRef}
      />
    </>
  );
}