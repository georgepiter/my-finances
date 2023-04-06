import { useEffect, useState } from "react";
import CardDashboard from "@/components/CardDashboard";
import {
  Container,
  useColorMode,
  SimpleGrid,
} from "@chakra-ui/react";

import { MdAttachMoney } from "react-icons/md";
import { FiArrowDownCircle, FiCreditCard } from "react-icons/fi";

import { getSession } from "next-auth/react";

import Layout from "@/components/template/Layout";

import { getDebtDash } from "@/services/debt";

import { DashDTO } from "@/dto/http/DashDTO";
import { useRegister } from "@/hooks/useRegister";
import HistoryAllByRegisterTable from "@/components/tables/HistoryAllByRegisterTable";

export default function Dashboard() {
  const { colorMode } = useColorMode();

  const { registerBase } = useRegister();

  const [userId, setUserId] = useState(Number);

  const [dash, setDash] = useState<DashDTO>({} as DashDTO);

  async function loadSession() {
     const session = await getSession();
     if (session?.user.id) {
       setUserId(session.user.id);
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

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (userId) {
      loadValuesRegister(userId, registerBase.registerId);
    } 

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <Layout>
      <Container maxW="6xl" mt={10}>
        <SimpleGrid columns={{ md: 3, sm: 1 }} spacing={2} w="100%" h="100%">
          <CardDashboard
            color="green.600"
            title="Entrada"
            value={dash.totalEntryValue ? Number(dash.totalEntryValue) : 0}
            isLoaded={dash.totalEntryValue != null}
            icon={<MdAttachMoney size={25} />}
          />

          <CardDashboard
            color="red.600"
            title="Gastos"
            value={dash.totalDebt ? - Number(dash.totalDebt) : 0}
            isLoaded={dash.totalDebt != null}
            icon={<FiArrowDownCircle size={25} />}
          />

          <CardDashboard
            color="blue.600"
            title="Saldo"
            value={dash.currentTotalValue ? Number(dash.currentTotalValue) : 0}
            isLoaded={dash.currentTotalValue != null}
            icon={<FiCreditCard size={25} />}
          />
        </SimpleGrid>
      </Container>

      <Container maxW="6xl" mt={5}>
        <HistoryAllByRegisterTable registerId={registerBase.registerId} />
      </Container>
    </Layout>
  );
}
