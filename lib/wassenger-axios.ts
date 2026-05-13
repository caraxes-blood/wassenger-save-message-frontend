import axios, { type AxiosError } from "axios";

import { getWassengerBaseUrl } from "./wassenger-env";

function isLoginRequest(error: AxiosError): boolean {
  const url = error.config?.url ?? "";
  return url.endsWith("/auth/login") || url.includes("/auth/login");
}

export function createWassengerClient() {
  const api = axios.create({
    baseURL: getWassengerBaseUrl(),
    withCredentials: true,
  });

  api.interceptors.response.use(
    (r) => r,
    (err: unknown) => {
      if (!axios.isAxiosError(err)) {
        return Promise.reject(err);
      }
      const status = err.response?.status;
      if (
        status === 401 &&
        typeof window !== "undefined" &&
        !isLoginRequest(err)
      ) {
        window.location.assign("/login");
      }
      return Promise.reject(err);
    },
  );

  return api;
}
