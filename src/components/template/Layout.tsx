import Footer from "./Footer";
import NavbarTop from "./NavbarTop";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <NavbarTop />
        <main>{children}</main>
      <Footer />
    </>
  );
}