import { useContext } from "react";

import { RegisterContext, RegisterContextDataProps } from "@/contexts/RegisterContext";


export function useRegister(): RegisterContextDataProps {
  const context = useContext(RegisterContext);

  return context;
}
