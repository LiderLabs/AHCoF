
import type {
  CreateRegularAccountPayload,
  GetRegularAccountResponse,
  GetAccountsListResponse,
} from "@/src/features/savings/types";
import { api } from "@/src/lib/api";

export async function createRegularAccount(
  payload: CreateRegularAccountPayload
): Promise<GetRegularAccountResponse> {
  return api<GetRegularAccountResponse>("/savings/accounts/regular", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getSavingsAccounts(): Promise<GetAccountsListResponse> {
  return api<GetAccountsListResponse>("/accounts");
}

export async function getAccountById(
  accountId: string
): Promise<GetRegularAccountResponse> {
  return api<GetRegularAccountResponse>(`/savings/accounts/${accountId}`);
}