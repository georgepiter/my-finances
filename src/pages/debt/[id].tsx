import { useRouter } from "next/router";

export default function Debt() {
  const { query } = useRouter();

  return <h1>Product {JSON.stringify(query)}</h1>;
}
