// hooks/useAxios.js
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useMemo } from "react";

export const useAxios = () => {
  const { getToken } = useAuth();

  const authorizedAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [getToken]);

  return { authorizedAxios };
};
