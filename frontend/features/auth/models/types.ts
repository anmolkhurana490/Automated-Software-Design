export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user: User;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}