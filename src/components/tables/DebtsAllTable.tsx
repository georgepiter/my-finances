import { useColorMode, Tag } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { getAllDebtsByRegister } from "@/services/debt";
import { DebtDTO } from "@/dto/http/DebtDTO";

import DataTableBase from "../DataTable";

interface Props {
  userId: number;
}

export default function DebtsAllTable({ userId }: Props) {
  const { colorMode } = useColorMode();

  const [debts, setDebts] = useState<DebtDTO[]>([]);

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
          variant="solid"
          colorScheme={
            row.status == "Aguardando Pagamento" ? "orange" : "green"
          }
        >
          {row.status}
        </Tag>
      ),
    },
  ];


  async function loadDebts() {
    try {
      const res = await getAllDebtsByRegister(userId, "2023-03");
      if (res.status == 200) {
        console.log("res", res.data);
        setDebts(res.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadDebts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DataTableBase columns={columns} data={debts} title="Débitos" />
    </>
  );
}

