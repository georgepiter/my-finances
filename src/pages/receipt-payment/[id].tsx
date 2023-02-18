
import { Center, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { fileTypeFromBuffer } from "file-type";
import { fromByteArray } from "base64-js";

import { useEffect, useState } from "react";

import { getDebtById } from "@/services/debt";

import "@react-pdf-viewer/core/lib/styles/index.css";
import Image from "next/image";

interface Base64 {
  base64: string;
  type: string;
}
export default function ReceiptPayment() {
  const { query } = useRouter();
  const [height, setHeight] = useState(0);
  const [receiptImg, setReceiptImg] = useState<Base64>({} as Base64);

  const toast = useToast();
  
  function detectMimeType(b64: string) {
    const signatures = {
      "JVBERi0": "application/pdf",
      "iVBORw0KGgo": "image/png",
      "/9j/": "image/jpg",
    } as any;

    for (var s in signatures) {
      if (b64.indexOf(s) === 0) {
        return signatures[s];
      }
    }
  }

  async function loadDebt() {
     try {
      const res = await getDebtById(Number(query.id));

      if (res.status === 200) {
        const base64 = res.data.receiptPayment;
        const formatType = detectMimeType(base64);

        if (base64) {
          setReceiptImg({
            base64: base64,
            type: formatType,
          });
        }
      }

     } catch (error: any) {
       toast({
         title: error.message
           ? error.message
           : "Problema ao renderizar imagem.",
         status: "error",
         isClosable: true,
       });
     }
  }

  useEffect(() => {
    if (query.id) loadDebt();
  }, [query.id]);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(document.documentElement.clientHeight);
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <>
      {receiptImg && receiptImg.type == "application/pdf" ? (
        <iframe
          src={`data:application/pdf;base64, ${receiptImg.base64}`}
          width="100%"
          height={`${height}px`}
        />
      ) : (
        receiptImg.base64 && (
          <Center mt={10}>
            <Image
              src={`data:image/jpg;base64, ${receiptImg.base64}`}
              alt="Comprovante"
              width={600}
              height={1500}
            />
          </Center>
        )
      )}
    </>
  );
}
