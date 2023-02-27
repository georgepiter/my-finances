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
import brandImage from "../../assets/brand.png";

import { useProfile } from "@/hooks/useProfile";

export default function NavbarTop() {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const [user, setUser] = useState<UserSession>({} as UserSession);

  const [photoProfile, setPhotoProfile] = useState("");

  const { userProfile } = useProfile();

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
      <Box as="section" pb={{ base: "12", md: "24" }}>
        <Box as="nav" bg={colorMode == "dark" ? "black" : "white"}>
          <Flex justify="space-between" flex="1" p={3}>
            <HStack>
              <Image
                src={brandImage}
                alt="Brand Image"
                width={30}
                height={30}
                priority // lazy ,eager
                style={{ marginRight: "10px" }}
              />

              <Text as="b">controlZ</Text>
            </HStack>
            <ButtonGroup variant="link" spacing="8">
              {menuList.map((item) => {
                if (user.role == item.role) {
                  return (
                    <Button
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
                as={IconButton}
                aria-label="Options"
                icon={
                  <FiMenu
                    color={colorMode == "dark" ? "gray.50" : "gray.800"}
                  />
                }
                variant="outline"
                borderColor={colorMode == "dark" ? "gray.50" : "gray.800"}
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
                        colorMode == "dark" ? avatarDarkImage : avatarlightImage
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
        </Box>
      </Box>
    </>
  );
}
