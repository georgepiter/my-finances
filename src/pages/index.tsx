import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Dashboard from "./dashboard";
import User from "./admin/user";
import { getAllRegisterByUserId } from "@/services/register";
import { RegisterDTO } from "@/dto/http/RegisterDTO";
import Register from "./register";
import { useToast } from "@chakra-ui/react";
import Spinner from "@/components/Spinner";
import { UserSession } from "next-auth";
import { useProfile } from "@/hooks/useProfile";

export default function Home() {
  const router = useRouter();
  const toast = useToast();

  const { setProfile } = useProfile();
  const [user, setUser] = useState<UserSession>({} as UserSession);

  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function loadRegister(userId: number) {
    setIsLoading(true);
    try {
      const res = await getAllRegisterByUserId(userId);

      if (res.status === 200) {
        const register = res.data as RegisterDTO;

        setProfile({
          user: {
            photo: register.photo
          },
        });

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
    } finally {
      setIsLoading(false);
    }
  }

  async function loadSession() {
    const session = await getSession();
    if (session?.user) {
      setUser(session.user);
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (user.id)
      loadRegister(user.id);
  }, [user.id]);

    return (
      <>
        {user.role === "ROLE_ADMIN" ? (
          <User />
        ) : isLoading ? (
          <Spinner mt={50} />
        ) : isRegister ? (
          <Dashboard />
        ) : (
          <Register />
        )}
      </>
    );
}
