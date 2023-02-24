import useAuth from "@/hooks/useAuth";
import Footer from "./Footer";
import NavbarTop from "./NavbarTop";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  useAuth(true);

  return (
    <>
      <NavbarTop />
      <main >{children}</main>

      <Footer />
    </>
  );
}