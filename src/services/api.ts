import { getToken } from "@/src/storage/auth-storage";
import axios from "axios";

export const API_URL = "https://controle-financeiro-api-vert.vercel.app";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
