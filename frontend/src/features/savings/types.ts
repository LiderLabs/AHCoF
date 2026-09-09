export type AccountType =
  | "regular_account"
  | "kidi_account"
  | "education_fund"
  | "purpose_driven";

export type AccountStatus = "active" | "matured" | "closed" | "frozen";

// ---- Shared sub-fields ----

export interface ContributorInformation {
  contributorId: string;
  contributorsName: string;
  relationshipToChild: string;
  amountContributed: number; // minor units (pesewas)
  dateOfContribution: string; // ISO8601
}

export interface ContributionHistoryEntry {
  contributionDate: string; // ISO8601
  amountContributed: number; // minor units (pesewas)
}

// ---- Shared base account shape (matches doc section 2.14) ----

export interface BaseSavingsAccount {
  accountId: string;
  memberId: string;
  accountNumber: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
  currentBalance: number; // minor units
  currency: string; // e.g. "GHS"
  interestEarned: number; // minor units
  autoTransfer: boolean;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  contributionHistory: ContributionHistoryEntry[];
  contributorsInformation: ContributorInformation[];
}

// ---- Regular Savings Account (matches doc section 2.15) ----

export interface RegularAccountDetails {
  amountContributedThatMonth: number; // minor units
  isPrimary: boolean;
}

export interface RegularSavingsAccount extends BaseSavingsAccount {
  accountType: "regular_account";
  accountDetails: RegularAccountDetails;
}

// ---- Regular Account request payload ----

export interface CreateRegularAccountPayload {
  autoTransfer?: boolean;
  isPrimary?: boolean;
}

// ---- API response envelopes ----

//response depending on the account type, the data field will contain the corresponding account details
export interface SavingsApiResponse<T> {
  status: "success" | "error";
  data: T;
}

// response for creating a new regular savings account
export type GetRegularAccountResponse = SavingsApiResponse<RegularSavingsAccount>;

// response for fetching a list of all savings accounts for a member
export interface AccountsListData {
  accounts: RegularSavingsAccount[];
}
export type GetAccountsListResponse = SavingsApiResponse<AccountsListData>;

export interface ContributionsListData {
  contributions: ContributionHistoryEntry[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
}
export type GetContributionsResponse = SavingsApiResponse<ContributionsListData>;

// ---- Kidi Account ----

export interface KidiAccountDetails {
  childName: string;
  nextTransferDate: string; // ISO8601
  nextTransferAmount: number; // minor units
  maturityDate: string; // ISO8601
}

export interface KidiAccount extends BaseSavingsAccount {
  accountType: "kidi_account";
  accountDetails: KidiAccountDetails;
}

export interface CreateKidiAccountPayload {
  childName: string;
  nextTransferDate: string;
  nextTransferAmount: number;
  maturityDate: string;
  autoTransfer?: boolean;
}

export type GetKidiAccountResponse = SavingsApiResponse<KidiAccount>;

// ---- Education Fund Account ----

export interface EducationFundDetails {
  goalName: string;
  targetAmount: number; // minor units
  progressPercentage: number; // server-computed, not sent on create
  maturityDate: string;
}

export interface EducationFundAccount extends BaseSavingsAccount {
  accountType: "education_fund";
  accountDetails: EducationFundDetails;
}

export interface CreateEducationFundPayload {
  goalName: string;
  targetAmount: number;
  maturityDate: string;
  autoTransfer?: boolean;
}

export type GetEducationFundResponse = SavingsApiResponse<EducationFundAccount>;

// ---- Purpose-Driven Account ----

export interface PurposeDrivenDetails {
  goalName: string;
  targetAmount: number;
  progressPercentage: number; // server-computed
  maturityDate: string;
}

export interface PurposeDrivenAccount extends BaseSavingsAccount {
  accountType: "purpose_driven";
  accountDetails: PurposeDrivenDetails;
}

export interface CreatePurposeDrivenPayload {
  goalName: string;
  targetAmount: number;
  maturityDate: string;
  autoTransfer?: boolean;
}

export type GetPurposeDrivenResponse = SavingsApiResponse<PurposeDrivenAccount>;