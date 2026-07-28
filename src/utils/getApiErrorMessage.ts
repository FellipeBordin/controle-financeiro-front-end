import { isAxiosError } from "axios";

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Ocorreu um erro inesperado.",
): string {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  if (error.code === "ECONNABORTED") {
    return "O servidor demorou para responder. Tente novamente.";
  }

  if (!error.response) {
    return "Não foi possível conectar ao servidor.";
  }

  if (error.response.status === 401) {
    return (
      error.response.data?.message ??
      error.response.data?.error ??
      "E-mail ou senha inválidos."
    );
  }

  return (
    error.response.data?.message ??
    error.response.data?.error ??
    fallbackMessage
  );
}
