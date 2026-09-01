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

export interface RefreshRequest {
  refreshToken: string;
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