import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Dashboard from "./dashboard";
import User from "./admin/user";
import { getAllRegisterByUserId } from "@/services/register";
import { RegisterDTO } from "@/dto/http/RegisterDTO";
import Register from "./register";
import { useToast } from "@chakra-ui/react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [isRegister, setIsRegister] = useState(false);

  async function loadRegister(userId: number) {
    try {
      const res = await getAllRegisterByUserId(userId);

       if (res.status === 200) {
        const register = res.data as RegisterDTO;

        if (register.registerId) {
          setIsRegister(true);
        } else {
          setIsRegister(false);
        }
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
    if (!session) {
      router.push({
        pathname: "/signIn",
      });
    } else {
      /** Verifica se já existe registro inserido pro usuário logado */
      loadRegister(session.user.id);
    }
    
    return () => {};
  }, []);

  if (session)
    return (
      <>
        {
          session.user.role === "ROLE_ADMIN"?
            <User />
            :
            (isRegister? <Dashboard/>: <Register/> )
        }
      </>
    );
};
