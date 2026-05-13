import axios from "axios";
import { getSession } from "next-auth/react";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "localhost:8000";

const client = axios.create({ baseURL: BASE });

// Request interceptor: attach auth token if present
client.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    const sessionUser = session?.user as any;
    const token = sessionUser?.accessToken || sessionUser.user?.accessToken as string | undefined;
    // const token = localStorage.getItem("token");
    // console.log("Attaching session token to request:", token);

    if (token) config.headers.set({ ...(config.headers || {}), Authorization: `Bearer ${token}` });
  } catch (e) {
    // ignore
  }
  return config;
});

// Response interceptor: simple error normalization
client.interceptors.response.use(
  (res) => res,
  (err) => {
    // normalize axios error to throw useful message
    if (err.response) {
      const payload = err.response.data;
      const message = payload.message || err.message;
      const e = new Error(message);
      // @ts-ignore
      e.status = err.response.status;
      throw e;
    }
    throw err;
  },
);

export default client;
