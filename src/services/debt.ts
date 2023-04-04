
import { api } from "@/data/api";
import { DebtModel, DebtPayModel } from "@/models/debt";

export const createDebt = async (data: DebtModel) => {
  return await api.post(`${process.env.BASE_URL_AUTH}/debt/`, data);
};

export const getAllRegisterByRegister = async (registerId: number, userId: number) => {
  return await api.get(
    `${process.env.BASE_URL_AUTH}/debt/all/${userId}/${registerId}`
  );
};

export const getDebtById = async (debtId: number) => {
  return await api.get(`${process.env.BASE_URL_AUTH}/debt/${debtId}`);
};

export const deleteDebt = async (debtId: number) => {
  return await api.delete(`${process.env.BASE_URL_AUTH}/debt/${debtId}`);
};

export const updateDebt = async (data: DebtModel) => {
  return await api.put(`${process.env.BASE_URL_AUTH}/debt/update`, data);
};

export const updateDebtPay = async (data: DebtPayModel) => {
  return await api.put(`${process.env.BASE_URL_AUTH}/debt/pay`, data);
};

export const getDebtDash = async (userId: number, registerId: number) => {
  return await api.get(
    `${process.env.BASE_URL_AUTH}/debt/dash/${userId}/${registerId}`
  );
};

export const getAllDebtsByRegister = async (
  registerId: number,
  date: string
) => {
  return await api.get(
    `${process.env.BASE_URL_AUTH}/debt/allDebts/${registerId}/${date}`
  );
};

