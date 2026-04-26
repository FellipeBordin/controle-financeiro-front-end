import { api } from "./api";
import type { LoginResponse, RegisterResponse } from "@/src/types/auth";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post<RegisterResponse>(
    "/api/auth/register",
    payload,
  );
  return response.data;
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post<LoginResponse>("/api/auth/login", payload);
  return response.data;
}
