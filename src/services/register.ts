import { api } from "@/data/api";
import { RegisterModel } from "@/models/register";

export const getAllRegisterByUserId = async (userId: number) => {
  return await api.get(`${process.env.BASE_URL_AUTH}/register/user/${userId}`);
};

export const createRegister = async (data: RegisterModel) => {
  return await api.post(`${process.env.BASE_URL_AUTH}/register/`, data);
};

export const getRegisterById = async (registerId: number) => {
  return await api.get(
    `${process.env.BASE_URL_AUTH}/register/${registerId}`
  );
};

export const updateRegister = async (data: RegisterModel) => {
  return await api.put(`${process.env.BASE_URL_AUTH}/register/`, data);
};

export const getRegisterByUserId = async (userId: number) => {
  return await api.get(`${process.env.BASE_URL_AUTH}/register/user/${userId}`);
};

export const addOthersByRegisterId = async (
  userId: number,
  otherValue: number,
) => {
  return await api.post(
    `${process.env.BASE_URL_AUTH}/register/addOthers/${userId}/${otherValue}`
  );
};


