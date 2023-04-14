import { api } from "@/data/api";

interface User {
  name: string;
  password: string;
}

export const auth = async (data: User) => {
  const response = await api.post("/login", data);
  return response.data;  
};