import { getToken } from "@/src/storage/auth-storage";
import axios from "axios";

export const API_URL = "https://controle-financeiro-api-vert.vercel.app";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  console.log("URL:", `${config.baseURL}${config.url}`);
  console.log("Token recuperado:", token);
  console.log("Tipo do token:", typeof token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

    console.log("Authorization enviado:", config.headers.Authorization);
  }

  return config;
});
