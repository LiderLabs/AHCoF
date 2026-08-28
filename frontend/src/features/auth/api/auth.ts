import { apiRequest } from "@/src/lib/api";

interface SignupPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  password: string;
}

interface LoginPayload {
  identifier: string;
  password: string;
}

interface AuthResponse {
  member: any;
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresIn: number;
}

export function signup(payload: SignupPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}