import {
  Container
} from "@chakra-ui/react";

import Layout from "@/components/template/Layout";
import { useRegister } from "@/hooks/useRegister";

import HistoryTable from "@/components/tables/HistoryTable";
import DebtsAllTable from "@/components/tables/DebtsAllTable";

import { useSession } from "next-auth/react";

export default function History() {

  const { registerBase } = useRegister();
  const { data: session } = useSession();

  return (
    <Layout>
      <Container maxW="6xl" mt={10}>
        <HistoryTable registerId={registerBase.registerId} />
      </Container>

      <Container maxW="6xl" mt={10} mb={10}>
        {session?.user?.id && <DebtsAllTable userId={session.user.id} />}
      </Container>
    </Layout>
  );
}
