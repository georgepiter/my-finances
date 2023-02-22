import { errorHandler } from "@/utils/errorHandler";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const api = axios.create({
  baseURL: publicRuntimeConfig.backendUrl,
  headers: {
    "Content-Type": "application/json;",
    // "Accept-Charset": "utf-8;",
    "Access-Control-Allow-Origin": "*",
  },
});

/**
 * Interceptor Headers:
 * - Authorization
 * - versao
 *
 * Envia para todas as requests que não seja a de Autenticação
 */
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const session = await getSession();

    config.headers = config.headers ?? {};

    if (session?.token) {
      config.headers["Authorization"] = "Bearer " + session.token;
    }
    return Promise.resolve(config);
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      // if (error.response.status === 403 && !session) {
      //   window.location.href = `${window.location.origin}/signIn`;
      // }
      return Promise.reject(errorHandler(error));
    } else {
      return Promise.reject(error);
    }
  }
);

export { api };
