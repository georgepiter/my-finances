import { useEffect, useState } from "react";

import Image from "next/image";

import {
  Image as ImageBase,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";

import { FiMenu, FiSettings, FiLogOut, FiLock } from "react-icons/fi";

import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { UserSession } from "next-auth";
import { useRouter } from "next/router";

import avatarDarkImage from "../../assets/_dark/avatar.png";
import avatarlightImage from "../../assets/_light/avatar.png";

import { useProfile } from "@/hooks/useProfile";

import logoDark from "../../assets/_dark/logo.png";
import logoLight from "../../assets/_light/logo.png";
import useAuth from "@/hooks/useAuth";


export default function NavbarTop() {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const [user, setUser] = useState<UserSession>({} as UserSession);

  const [photoProfile, setPhotoProfile] = useState("");

  const { userProfile } = useProfile();

  const isAuthenticated = useAuth(true);

  const menuList = [
    {
      title: "Dashboard",
      route: "dashboard",
      role: "ROLE_MANAGER",
    },
    {
      title: "Débitos",
      route: "debt",
      role: "ROLE_MANAGER",
    },
    {
      title: "Usuários",
      route: "admin/user",
      role: "ROLE_ADMIN",
    },
    {
      title: "Categorias",
      route: "admin/category",
      role: "ROLE_ADMIN",
    },
    {
      title: "Históricos",
      route: "history",
      role: "ROLE_MANAGER",
    },
  ];

  function handleSignOut() {
    signOut({
      callbackUrl: `${window.location.origin}/signIn`,
    });
  }

  function handleSettings() {
    router.push({
      pathname: "/settings",
    });
  }

  function handleProfile() {
    router.push({
      pathname: "/profile",
    });
  }

  function handleRouteItem(route: string) {
    router.push({
      pathname: "/" + route,
    });
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
    if (userProfile?.user?.photo) setPhotoProfile(userProfile.user.photo);
  }, [userProfile?.user?.photo]);

  return (
    <>
      <Box as="section">
        <Box
          as="nav"
          bgGradient={
            colorMode == "dark"
              ? "linear(to-l, primary.800, primary.900)"
              : "linear(to-l, primary.600, primary.700)"
          }
          boxShadow="md"
        >
          <HStack>
            <Image
              src={colorMode == "dark" ? logoLight : logoLight}
              alt="Brand Image"
              style={{ height: "auto", width: "135px" }}
            />

            <Flex justify="flex-end" flex="1" p={2}>
              <ButtonGroup variant="link" spacing="8" mr={10}>
                {menuList.map((item) => {
                  if (
                    (user.name !== "admin" && item.role === "ROLE_MANAGER") ||
                    (user.name === "admin" && item.role === user.role)
                  ) {
                    return (
                      <Button
                        color="white"
                        key={item.title}
                        onClick={() => handleRouteItem(item.route)}
                      >
                        {item.title}
                      </Button>
                    );
                  }
                })}
              </ButtonGroup>
              <Menu>
                <MenuButton
                  mt={2}
                  as={IconButton}
                  aria-label="Options"
                  icon={
                    <FiMenu color={colorMode == "dark" ? "gray.50" : "white"} />
                  }
                  variant="outline"
                  borderColor={colorMode == "dark" ? "gray.50" : "white"}
                />
                <MenuList>
                  <MenuItem justifyContent="center">
                    {userProfile?.user?.photo ? (
                      <ImageBase
                        borderRadius="full"
                        w={50}
                        h={50}
                        src={`data:image/jpeg;base64,${userProfile?.user?.photo}`}
                        alt="Photo Register"
                      />
                    ) : (
                      <Image
                        src={
                          colorMode == "dark"
                            ? avatarDarkImage
                            : avatarlightImage
                        }
                        width={50}
                        alt="Brand Image"
                      />
                    )}
                  </MenuItem>
                  <MenuItem justifyContent="center">
                    <Text fontSize="xl" as="b">
                      Olá, {user.name}
                    </Text>
                  </MenuItem>
                  <MenuItem icon={<FiSettings />} onClick={handleSettings}>
                    Configurações
                  </MenuItem>
                  <MenuItem icon={<FiLock />} onClick={handleProfile}>
                    Alterar Senha
                  </MenuItem>
                  <MenuItem onClick={handleSignOut} icon={<FiLogOut />}>
                    Sair
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </HStack>
        </Box>
      </Box>
    </>
  );
}
