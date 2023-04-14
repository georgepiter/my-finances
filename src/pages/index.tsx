import { useEffect, useState } from "react";

import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UserSession } from "next-auth";

import { setCookie } from "cookies-next";

import { useToast } from "@chakra-ui/react";

import { RegisterDTO } from "@/dto/http/RegisterDTO";

import { getRegisterByUserId } from "@/services/register";
import Spinner from "@/components/Spinner";

import { useRegister } from "@/hooks/useRegister";
import { useProfile } from "@/hooks/useProfile";

import { RegisterProps } from "@/contexts/RegisterContext";

export default function Home() {
  const router = useRouter();
  const toast = useToast();

  const { setProfile } = useProfile();
  const { setRegister } = useRegister();

  const [user, setUser] = useState<UserSession>({} as UserSession);

  const [isLoading, setIsLoading] = useState(false);

  async function loadRegister(userId: number) {
    setIsLoading(true);

    try {
      const res = await getRegisterByUserId(userId);

      if (res.status === 200) {
        const register = res.data as RegisterDTO;

        if (!register.registerId) {
          router.push({
            pathname: "/register",
          });
        } else {
          setProfile({
            user: {
              photo: register.photo,
            },
          });

          const registerBase = {
            registerId: register.registerId,
            salary: Number(register.salary),
            others: Number(register.others)
          } as RegisterProps;

          setRegister(registerBase);
          router.push({
            pathname: "/dashboard",
          });
        }
      }
    } catch (error: any) {
      console.log(error);

    } finally {
      setIsLoading(false);
    }
  }

  async function loadSession() {
    const session = await getSession();

    if (session && !session.error) {

      setCookie("role", session.user.role);

      if (
        (session.user.name === "admin" && session.user.role === "ROLE_ADMIN") ) {
        router.push({
          pathname: "/admin/user",
        });
      } else {
        loadRegister(session.user.id);
      }
    } else {
      router.push({
        pathname: "/signIn",
      });
    }
  }

  useEffect(() => {
    loadSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && (
        <Spinner
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  );
}
