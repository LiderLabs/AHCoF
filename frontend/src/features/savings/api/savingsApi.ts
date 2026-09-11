import type { ScheduleTransferPayload, ScheduleTransferResponse } from "../types";
import type {
  CreateRegularAccountPayload,
  GetRegularAccountResponse,
  GetAccountsListResponse,
  CreateKidiAccountPayload,
  GetKidiAccountResponse,
  CreateEducationFundPayload,
  GetEducationFundResponse,
  CreatePurposeDrivenPayload,
  GetPurposeDrivenResponse,
  
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
  return api<GetAccountsListResponse>("/savings/accounts");
}

export async function getAccountById(
  accountId: string
): Promise<GetRegularAccountResponse> {
  return api<GetRegularAccountResponse>(`/savings/accounts/${accountId}`);
}

export async function createKidiAccount(
  payload: CreateKidiAccountPayload
): Promise<GetKidiAccountResponse> {
  return api<GetKidiAccountResponse>("/savings/accounts/kidi", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createEducationFundAccount(
  payload: CreateEducationFundPayload
): Promise<GetEducationFundResponse> {
  return api<GetEducationFundResponse>("/savings/accounts/education-fund", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createPurposeDrivenAccount(
  payload: CreatePurposeDrivenPayload
): Promise<GetPurposeDrivenResponse> {
  return api<GetPurposeDrivenResponse>("/savings/accounts/purpose-driven", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function scheduleTransfer(
  accountId: string,
  payload: ScheduleTransferPayload
): Promise<ScheduleTransferResponse> {
  // TODO: confirm actual path with backend
  return api<ScheduleTransferResponse>(`/api/v1/savings/accounts/${accountId}/scheduled-transfers`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}