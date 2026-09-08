import type { RegularSavingsAccount, CreateRegularAccountPayload } from "@/src/features/savings/types";

export async function createRegularAccount(
  payload: CreateRegularAccountPayload
): Promise<RegularSavingsAccount> {
  //  real API call here once endpoint is ready
  console.log("createRegularAccount payload:", payload);

  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    accountId: "stub-id",
    memberId: "stub-member",
    accountNumber: "0000000000",
    accountType: "regular_account",
    accountStatus: "active",
    currentBalance: 0,
    currency: "GHS",
    interestEarned: 0,
    autoTransfer: payload.autoTransfer ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contributionHistory: [],
    contributorsInformation: [],
    accountDetails: {
      amountContributedThatMonth: 0,
      isPrimary: payload.isPrimary ?? false,
    },
  };
}