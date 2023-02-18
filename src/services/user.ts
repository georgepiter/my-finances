import { api } from "@/data/api";
import { UserStatusDTO } from "@/dto/http/UserStatusDTO";
import { UserModel } from "@/models/user";

export const createUser = async (data: UserModel) => {
  return await api.post(`${process.env.BASE_URL_AUTH}/user/create/`, data);
};

export const forgotUser = async (data: UserModel) => {
  return await api.post(`${process.env.BASE_URL_AUTH}/user/forgot/`, data);
};

export const resetUser = async (data: UserModel) => {
  return await api.post(`${process.env.BASE_URL_AUTH}/user/reset/`, data);
};

export const listAllUser = async () => {
  return await api.get(`${process.env.BASE_URL_AUTH}/user/all/`);
};

export const deleteUser = async (userId: number) => {
  return await api.delete(`${process.env.BASE_URL_AUTH}/user/${userId}`);
};


export const updateStatusUser = async (data: UserStatusDTO) => {
  return await api.put(`${process.env.BASE_URL_AUTH}/user/status/`, data);
};