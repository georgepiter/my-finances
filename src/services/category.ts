import { api } from "@/data/api";
import { CategoryModel } from "@/models/category";

export const listAllCategory = async (registerId: number) => {
  return await api.get(
    `${process.env.BASE_URL_AUTH}/category/all/${registerId}`
  );
};

export const createCategory = async (data: CategoryModel) => {
  return await api.post(`${process.env.BASE_URL_AUTH}/category/`, data);
};

export const deleteCategory = async (idCategory: number, registerId: number) => {
  return await api.delete(
    `${process.env.BASE_URL_AUTH}/category/${idCategory}/${registerId}`
  );
};

export const getCategoryById = async (idCategory: number) => {
  return await api.get(`${process.env.BASE_URL_AUTH}/category/${idCategory}`);
};

export const updateCategory = async (data: CategoryModel) => {
  return await api.put(`${process.env.BASE_URL_AUTH}/category/update`, data);
};