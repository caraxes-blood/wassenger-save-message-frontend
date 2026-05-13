import axios from "axios";

import { getWassengerBaseUrl } from "./wassenger-env";

export function createWassengerClient() {
  const api = axios.create({
    baseURL: getWassengerBaseUrl(),
    withCredentials: true,
  });

  api.interceptors.response.use(
    (r) => r,
    (err: unknown) => {
      const status = getResponseStatus(err);
      if (status === 401 && typeof window !== "undefined") {
        window.location.assign("/login");
      }
      return Promise.reject(err);
    },
  );

  return api;
}

function getResponseStatus(err: unknown): number | undefined {
  if (typeof err !== "object" || err === null) return undefined;
  if (!("response" in err)) return undefined;
  const res = (err as { response?: { status?: number } }).response;
  return res?.status;
}
