


import { HamburgerIcon } from "@chakra-ui/icons";
import {
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button as ButtonBase,
  Text,
  IconButton as IconButtonBase,
  useColorMode,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useToast,
  useTheme,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { HistoryDTO } from "@/dto/http/HistoryDTO";
import { deleteHistory, getAllHistoryByRegister } from "@/services/history";
import DataTableBase from "../DataTable";

interface Props {
  registerId: number
}

export default function HistoryTable({ registerId }: Props) {
  const toast = useToast();

  const { colorMode } = useColorMode();
  const [historyId, setHistoryId] = useState<number>(0);
  const [history, setHistory] = useState<HistoryDTO[]>([]);

  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();

  const cancelRef = useRef<HTMLInputElement>(null);

  const columns = [
    {
      name: "Período",
      selector: (row: any) => row.period,
    },
    {
      name: "Entradas",
      selector: (row: any) =>
        new Intl.NumberFormat("pt-br", {
          style: "currency",
          currency: "BRL",
        }).format(Number(row.balanceCredit)),
    },
    {
      name: "Débito",
      selector: (row: any) =>
        new Intl.NumberFormat("pt-br", {
          style: "currency",
          currency: "BRL",
        }).format(Number(row.totalDebt)),
    },
    {
      name: "Saldo",
      selector: (row: any) =>
        new Intl.NumberFormat("pt-br", {
          style: "currency",
          currency: "BRL",
        }).format(Number(row.totalCredit)),
    },
    {
      name: "Ações",
      selector: (row: any) => (
        <Menu>
          <MenuButton
            rounded={20}
            bg={colorMode == "dark" ? "gray.500" : "gray.50"}
            as={IconButtonBase}
            icon={<HamburgerIcon />}
          />
          <MenuList minWidth="150px">
            <MenuItem onClick={() => handleConfirm(row.financialHistoryId)}>
              <HStack flex={1} justifyContent="space-between">
                <Text>Excluir</Text>
                <FiTrash2 />
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ];

  function handleConfirm(id: number) {
    setHistoryId(id);

    onOpenConfirm();
  }

  async function handleDelete() {
    try {
      const res = await deleteHistory(registerId, historyId);

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

  async function loadHistory() {
    try {
      const res = await getAllHistoryByRegister(registerId);
      if (res.status == 200) {
        setHistory(res.data.financialList);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

   useEffect(() => {
     if (registerId) loadHistory();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [registerId]);

  return (
    <>
      <DataTableBase columns={columns} data={history} title="Histórico" />

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
    </>
  );
}