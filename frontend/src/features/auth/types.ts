export interface SignupRequest {
  name: string;
  emailAddress: string;
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
//   accounts: Account[];
  gpsAddress: string;
}

export interface AuthResponse {
  member: Member;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}