import { createContext, ReactNode, useEffect, useState } from "react";

export interface RegisterProps {
  registerId: number;
  salary: number;
  others: number;
}

export interface RegisterContextDataProps {
  registerBase: RegisterProps;
  setRegister: (register: RegisterProps) => Promise<void>;
}

interface RegisterProviderProps {
  children: ReactNode;
}

export const RegisterContext = createContext({} as RegisterContextDataProps);

export function RegisterContextProvider({ children }: RegisterProviderProps) {
  const key = `@${process.env.APP_NAME + ":register"}`;

  const [registerBase, setRegisterBase] = useState<RegisterProps>(
    {} as RegisterProps
  );


  async function setRegister(register: RegisterProps) {
    try {
      await localStorage.setItem(key, JSON.stringify(register));
      setRegisterBase(register);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    async function loadStorageDate() {
      const registerStoraged = await localStorage.getItem(key);

      if (registerStoraged) {
        const registerLogged = JSON.parse(registerStoraged) as RegisterProps;
        setRegisterBase(registerLogged);
      }
    }
    loadStorageDate();
  }, [key]);


  return (
    <RegisterContext.Provider
      value={{
        setRegister,
        registerBase,
      }}
    >
        {children}
    </RegisterContext.Provider>
  );

}