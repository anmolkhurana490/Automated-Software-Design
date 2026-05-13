import client from "@/lib/api";
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "./models/types";

// Manual login
export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await client.post("/auth/login", data);
  return res.data;
};

// Manual signup
export const signupAPI = async (data: SignupRequest): Promise<SignupResponse> => {
  const res = await client.post("/auth/signup", data);
  return res.data;
};

// Google OAuth login/signup
export const googleAuthAPI = async (id_token: string): Promise<LoginResponse> => {
  const res = await client.post(`/auth/google`, { id_token });
  return res.data;
}

// Get current user
export const getCurrentUserAPI = async (): Promise<LoginResponse> => {
  const res = await client.get("/auth/me");
  return res.data;
};

// Logout (if needed)
export const logoutAPI = async (): Promise<void> => {
  const res = await client.post("/auth/logout");
  return res.data;
}