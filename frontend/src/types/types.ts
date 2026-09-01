export type MembershipType = string; 

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  gender: "female" | "male";
  membershipType: MembershipType;
  emailAddress: string;
  phoneNumber: string;
  churchBranch: string;
  conference: string;
  isActive: boolean;
  membershipId: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
  accounts: Account[]; 
  gpsAddress: string;
}

export interface ContributorInfo {
 
  [key: string]: unknown;
}

export interface Account {
  accountNumber: string;
  accountType: string;
  progress: number;
  currentBalance: number;
  accountOwnerName: string;
  maturityDate: number;
  guardianName: string;
  contributorsInformation: ContributorInfo[];
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  emailAddress?: string;
  password: string;
  phoneNumber: string;
}

export interface LoginRequest {
  identifier: string; // email or phone number
  password: string; 
}

export interface AuthResponse {
  member: Member | null; 
  accessToken: string;
  refreshToken: string | null; 
  tokenType: string;
  expiresIn: number;
}