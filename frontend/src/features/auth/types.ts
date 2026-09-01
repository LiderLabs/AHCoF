export interface SignupRequest {
  firstName: string;
  lastName: string;
  emailAddress?: string;
  password: string;
  phoneNumber: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  gender: "female" | "male";
  membershipType: string;
  emailAddress: string;
  phoneNumber: string;
  churchBranch: string;
  conference: string;
  isActive: boolean;
  membershipId: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
  //accounts: Account[];
  gpsAddress: string;
}

export interface AuthResponse {
  member: Member;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export type OtpChannel = "phone" | "email";

//after user clicks sign up button to create account, otp req sent
export interface SendOtpRequest {
  phoneNumber: string;
  emailAddress?: string;
}

//response user recives after hitting sign up button
export interface SendOtpResponse {
  channelsSent: OtpChannel[]; //either phone number or email address or both
  message: string;//message that comes with code inside
}

//after user enters code, otp verification req sent
export interface VerifyOtpRequest {
  channel: OtpChannel;
  identifier: string; // either the phone number or email the code belongs to
  code: string;//code user enters to verify
}

//response to verfication request, whether code is correct or not
export interface VerifyOtpResponse {
  channel: OtpChannel;
  verified: boolean;
  message: string;
}