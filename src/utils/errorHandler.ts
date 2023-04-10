import { AxiosError } from "axios";

export interface ErrorProps {
  message: string;
  status: number;
}

/**
 * Classe que trata os erros recebidos
 *
 * @param error
 * @returns
 */
export const errorHandler = (error: AxiosError) : ErrorProps  => {
  const { request, response } = error;

  if (response) {
    const data = {} as ErrorProps;

    data.status = response.status;
    if (response.status == 404 ) {

      const dataRes = response.data as ErrorProps;
      data.message = dataRes.message != "" && dataRes.message
        ? dataRes.message
        : "Erro no Servidor. Entre em contato com o administrador.";
    } else {
      const dataRes = response.data as ErrorProps;

      data.message = dataRes.message
        ? dataRes.message
        : "Opps! Alguma coisa deu errada.";
      data.status = dataRes.status;
    }
    return data;
  
  } else if (request) {
    const data = {} as ErrorProps;

    data.status = request.status;
    if (request.status === 503) {
      data.message = "Verifique sua conexão com a Internet.";
    }

    data.message = "Opps! Alguma coisa deu errada.";
    return data;
  } else {
    return { message: "Opps! Alguma coisa deu errada.", status: 500 };
  }
};
