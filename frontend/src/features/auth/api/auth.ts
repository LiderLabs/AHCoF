import { api } from "@/src/lib/api";
import { AuthResponse } from "../schema";

interface SignupPayload {
  firstName: string;
  lastName: string;
  emailAddress?: string;
  phoneNumber: string;
  password: string;
}

interface LoginPayload {
  identifier: string;
  password: string;
}


export function signup(payload: SignupPayload): Promise<AuthResponse> {
  return api<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return api<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}