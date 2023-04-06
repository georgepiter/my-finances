import { useColorMode, Tag, HStack, Heading, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { getAllDebtsByRegister } from "@/services/debt";
import { DebtDTO } from "@/dto/http/DebtDTO";
import Box from "@/components/Box";
import { Input } from "@/components/Input";

import DataTableBase from "../DataTableBase";

interface Props {
  userId: number;
}

export default function DebtsAllTable({ userId }: Props) {
  const { colorMode } = useColorMode();

  const [debts, setDebts] = useState<DebtDTO[]>([]);
  const [filterDebt, setFilterDebt] = useState("");

  const columns = [
    {
      name: "Descrição",
      selector: (row: any) => row.debtDescription,
    },
    {
      name: "Valor",
      selector: (row: any) =>
        new Intl.NumberFormat("pt-br", {
          style: "currency",
          currency: "BRL",
        }).format(Number(row.value)),
    },
    {
      name: "Data Vencimento",
      selector: (row: any) => new Date(row.dueDate).toLocaleDateString(),
    },
    {
      name: "Data Pagamento",
      selector: (row: any) =>
        row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : "-",
    },
    {
      name: "Status",
      selector: (row: any) => (
        <Tag
          size="sm"
          variant="solid"
          borderRadius="full"
          colorScheme={row.status == "AWAITING_PAYMENT" ? "orange" : "green"}
        >
          {row.status === "AWAITING_PAYMENT" ? "Aguardando Pagamento" : "Pago"}
        </Tag>
      ),
    },
  ];

  async function loadDebts(date: string) {
    try {
      const res = await getAllDebtsByRegister(userId, date);
      if (res.status == 200) {
        setDebts(res.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  function setFormatDate(d = "") {
    const dt = d !== "" ? new Date(d) : new Date();
    const date =
      dt.getFullYear() + "-" + (dt.getMonth() + 1).toString().padStart(2, "0");

    return date;
  }

  useEffect(() => {
   
    loadDebts(setFormatDate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterDebts(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value;
    loadDebts(setFormatDate(date));
  }

  return (
    <>
      <Box>
        <HStack display="flex" justifyContent="space-between">
          <Heading as="h4" size="md">
            Débitos
          </Heading>
          <Heading as="h4" size="md" mb={10}>
            <Input
              size="sm"
              placeholder="Selecione a data"
              type="date"
              onChange={handleFilterDebts}
            />
          </Heading>
        </HStack>
        <Divider mt={2} />
        <DataTableBase columns={columns} data={debts} title="" />
      </Box>
    </>
  );
}

