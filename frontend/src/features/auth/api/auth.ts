import { api } from "@/src/lib/api";
import { AuthResponse } from "../schema";
import { RefreshRequest } from "../types";
import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  Member,
} from "../types";
import { CompleteProfileRequest } from "@/src/types/types";

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
  return api<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function refreshAccessToken(payload: RefreshRequest): Promise<AuthResponse> {
  return api<AuthResponse>("/auth/refresh", { 
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export function sendOtp(payload: SendOtpRequest): Promise<SendOtpResponse> {
  // return api<SendOtpResponse>("/otp/send", {
  //   method: "POST",
  //   body: JSON.stringify(payload),
  // });

  console.log("MOCK sendOtp called with:", payload);
  return Promise.resolve({
    channelsSent: payload.emailAddress ? ["phone", "email"] : ["phone"],
    message: "Mock OTP sent",
  });
}

export function verifyOtp(
  payload: VerifyOtpRequest,
): Promise<VerifyOtpResponse> {
  // return api<VerifyOtpResponse>("/otp/verify", {
  //   method: "POST",
  //   body: JSON.stringify(payload),
  // });

  console.log("MOCK verifyOtp called with:", payload);
  return Promise.resolve({
    channel: payload.channel,
    verified: payload.code === "123456", // any code except 123456 will show "invalid"
    message: payload.code === "123456" ? "Verified" : "Invalid code",
  });
}

export function completeProfile(
  payload: CompleteProfileRequest,
): Promise<Member> {
  return api<Member>("/auth/member/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
