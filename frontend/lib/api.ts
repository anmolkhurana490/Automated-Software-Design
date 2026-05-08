import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "localhost:8000";

const client = axios.create({ baseURL: BASE });

// Request interceptor: attach auth token if present
client.interceptors.request.use((config) => {
  try {
    // const token = localStorage.getItem("token");
    // if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
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
      const message = JSON.stringify(payload) || err.message;
      const e = new Error(message);
      // @ts-ignore
      e.status = err.response.status;
      throw e;
    }
    throw err;
  },
);

export default client;
