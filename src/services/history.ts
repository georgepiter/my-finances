import { api } from "@/data/api";

export const getAllHistoryByRegister = async (registerId: number) => {
  return await api.get(
    `${process.env.BASE_URL_AUTH}/history/all/${registerId}`
  );
};

export const deleteHistory = async (registerId: number, historyId: number) => {
  return await api.delete(
    `${process.env.BASE_URL_AUTH}/history/${registerId}/${historyId}`
  );
};