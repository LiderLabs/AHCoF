import type { AccountType } from "../features/savings/types"

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  regular_account: "Regular Savings",
  kidi_account: "Kidi Account",
  education_fund: "Education Fund",
  purpose_driven: "Purpose Driven",
};