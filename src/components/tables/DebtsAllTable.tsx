import {
  Tag,
  HStack,
  Heading,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { getAllDebtsByRegister } from "@/services/debt";
import Box from "@/components/Box";
import { Input } from "@/components/Input";
import Divider from "@/components/Divider";

import { CategoryDTO } from "@/dto/http/CategoryDTO";
import { DebtDTO } from "@/dto/http/DebtDTO";

import DataTableBase from "../DataTableBase";

interface Props {
  userId: number;
}

interface DebtsCategory {
  categoryId: number;
  debtList: DebtDTO[];
}

interface Category {
  typeCategory: string;
  categoryId: number;
}

export default function DebtsAllTable({ userId }: Props) {
  const [debts, setDebts] = useState<DebtsCategory[]>([]);
  const [filterDebt, setFilterDebt] = useState("");

  const [categoriesDebt, setCategoriesDebt] = useState<CategoryDTO[]>([]);

  const columns = [
    {
      name: "Descrição",
      selector: (row: DebtDTO) => (
        <Tag size="lg" variant="solid" borderRadius="full" bg="primary.700">
          {row.debtDescription}
        </Tag>
      ),
    },
    {
      name: "Valor",
      selector: (row: DebtDTO) => (
        <Tag
          size="md"
          variant="solid"
          borderRadius="full"
          colorScheme={
            row.status == "Aguardando Pagamento" ? "orange" : "green"
          }
        >
          {new Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(Number(row.value))}
        </Tag>
      ),
    },
    {
      name: "Data Vencimento",
      selector: (row: DebtDTO) => (
        <Tag
          size="md"
          variant="solid"
          borderRadius="full"
          colorScheme={
            row.status == "Aguardando Pagamento" ? "orange" : "green"
          }
        >
          {new Date(row.dueDate).toLocaleDateString()}
        </Tag>
      ),
    },
    {
      name: "Dt. Pagamento",
      selector: (row: DebtDTO) =>
        row.paymentDate ? (
          <Tag
            size="md"
            variant="solid"
            borderRadius="full"
            colorScheme={
              row.status == "Aguardando Pagamento" ? "orange" : "green"
            }
          >
            {new Date(row.paymentDate).toLocaleDateString()}
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      name: "Status",
      selector: (row: DebtDTO) => (
        <Tag
          size="md"
          variant="solid"
          borderRadius="full"
          colorScheme={
            row.status == "Aguardando Pagamento" ? "orange" : "green"
          }
        >
          {row.status}
        </Tag>
      ),
    },
  ];

  async function loadDebts(date: string) {
    try {
      const res = await getAllDebtsByRegister(userId, date);
      if (res.status == 200) {
        setDebts(res.data.debtsCategoryGroupDTO);

        const categories = getCategories(res.data.debtsCategoryGroupDTO);
        setCategoriesDebt(categories);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  function getCategories(categories: Category[]) {
    const result: CategoryDTO[] = [];

    categories.forEach((category) => {
      result.push({
        categoryId: category.categoryId,
        description: category.typeCategory,
      });
    });
    return result;
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
        <Divider />

        {debts.length === 0 ? (
          <Text>Nenhum registro encontrado.</Text>
        ) : (
          <Tabs isFitted variant="unstyled">
            <TabList>
              {categoriesDebt.map((category) => (
                <Tab
                  key={category.categoryId}
                  color="white"
                  bg="gray.600"
                  _selected={{ color: "white", bg: "primary.700" }}
                >
                  <Text as="b">{category.description}</Text>
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {debts.map((category) => (
                <TabPanel key={category.categoryId}>
                  <DataTableBase
                    columns={columns}
                    data={category.debtList}
                    title=""
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}
      </Box>
    </>
  );
}

