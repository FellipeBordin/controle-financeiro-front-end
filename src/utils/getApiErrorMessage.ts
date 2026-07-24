import axios from "axios";

import type { ApiErrorResponse } from "@/src/types/api";

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Ocorreu um erro inesperado.",
): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  if (error.code === "ECONNABORTED") {
    return "O servidor demorou para responder. Tente novamente.";
  }

  if (!error.response) {
    return "Não foi possível conectar ao servidor.";
  }

  return (
    error.response.data?.message ??
    error.response.data?.error ??
    fallbackMessage
  );
}