import { Text } from "@chakra-ui/react";

interface Props {
  receipt: string;
}

export default function ReceiptPayment({ receipt }: Props) {
  return <Text>{receipt}</Text>;
}
