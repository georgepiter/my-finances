import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Dashboard from "./dashboard";
import User from "./admin/user";
import { getAllRegisterByUserId } from "@/services/register";
import { RegisterDTO } from "@/dto/http/RegisterDTO";
import Register from "./register";
import { Center, useToast } from "@chakra-ui/react";
import Spinner from "@/components/Spinner";
import { UserSession } from "next-auth";
import { useProfile } from "@/hooks/useProfile";
import SignIn from "./signIn";

export default function Home() {
  const router = useRouter();
  const toast = useToast();

  const { setProfile } = useProfile();
  const [user, setUser] = useState<UserSession>({} as UserSession);

  const [isLoading, setIsLoading] = useState(false);

  async function loadRegister(userId: number) {

    try {
      const res = await getAllRegisterByUserId(userId);

      if (res.status === 200) {
        const register = res.data as RegisterDTO;

        if (!register.registerId && user.role != "ROLE_ADMIN") {
          router.push({
            pathname: "/register",
          });
        } 

        setProfile({
          user: {
            photo: register.photo,
          },
        });
      }
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function loadSession() {
    setIsLoading(true);
    const session = await getSession();
    if (session?.user.id) {
      setUser(session.user);
    } 
  }

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (user.id) {
    loadRegister(user.id);
    }
     
  }, [user.id]);

    return (
      <>
        {isLoading || !user.id ? (
          <Spinner
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : user.role === "ROLE_ADMIN" ? (
          <User />
        ) : (
          <Dashboard />
        )}
      </>
    );
}
