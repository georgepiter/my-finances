import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import Footer from "./Footer";
import NavbarTop from "./NavbarTop";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const auth = useAuth(true);

  return (
    <>
      <NavbarTop />
        <main >{children}</main>
      <Footer />
    </>
  );
}