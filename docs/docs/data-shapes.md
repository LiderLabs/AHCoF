# AHCoF Data Shapes: Overview

**Simple version:** this file is a checklist. It shows every part of the app that needs a "data shape" (a defined structure for what fields an object has). Items in **bold** are already done.

## 1. Where data shapes are needed

1. Member (just means user)
2. Loans module
3. Notification
4. Shares
5. Dividend
6. Portfolio summary
7. Recent activities
8. **Savings module** (has types: regular, purpose-driven, kidi, education fund accounts, refer to more of that in no.27 of savings module)
9. Form center forms
10. Deposit & withdrawals
11. Transaction history
12. **Account**
13. **Contributor's information**
14. **Login + Sign up**
15. **Auth response**
16. **Complete profile request**
17. **Send OTP request** (to send OTP request)
18. **Verify OTP request** (to verify OTP request)
19. **Verify OTP response** (to verify OTP response)
20. **OTP channel** (either phone number or email address)
21. **Send OTP response** (to send response to OTP request)
22. **Refresh request** (for biometric login)
23. **Regular savings account**
24. **Kidi account**
25. **Contributors information**
26. **Contribution history**
27. **Savings account base/shared data shape**
28. **Create Account Payload base data shape**  
29. **Full data shapes for each savings account**
30. **"Details" data shape for all savings account types**
31. **Data shapes for each type of savings account's payload**
32. **Savings module response(for a single account)**
33. **Savings module response(for all accounts the user has)**
34. **Savings module response(for contribution history)**  

# AHCoF Data Shapes — Core (Member, Account & Auth)

## 1. Member
 
The user's account.
 
- `id` (string)
- `firstName` (string)
- `lastName` (string)
- `gender` (string)
- `membershipType` (string)
- `emailAddress` (string)
- `phoneNumber` (string)
- `churchBranch` (string)
- `conference` (string)
- `isActive` (boolean)
- `membershipId` (string)
- `isDemo` (boolean)
- `createdAt` (string)
- `updatedAt` (string)
- `accounts` (array)
- `gpsAddress` (string)
## 2. Account
 
The money account, tied to the savings module.
 
- `accountNumber` (string)
- `accountType` (string)
- `progress` (integer)
- `currentBalance` (number/integer)
- `accountOwnerName` (string)
- `maturityDate` (integer)
- `guardianName` (string)
- `contributorsInformation` (array of objects)
## 3. Signup (request)
 
- `firstName` (string)
- `lastName` (string)
- `email` (string) — *optional*
- `password` (string)
- `phoneNumber` (string)
## 4. Login (request)
 
*You can log in with either email or phone number.*
 
- `identifier` (string) — can be email or phone number, not both
- `password` (string)
## 5. Auth response
 
- `member` (Member object — see section 1)
- `accessToken` (string)
- `refreshToken` (string)
- `tokenType` (string)
- `expiresIn` (integer/number)
## 6. Complete profile request
 
- `gender` (string)
- `churchBranch` (string)
- `conference` (string)
- `membershipType` (string) — defaults to church member
- `gpsAddress` (string)
## 7. Send OTP request
 
- `phoneNumber` (string)
- `emailAddress` (string) — *optional, only if just a phone number was entered*
## 8. Verify OTP request
 
- `channel` (string) — value is `"email"` or `"phone"`
- `identifier` (string) — either email address or phone number
- `code` (string)
## 9. Verify OTP response
 
- `channel` (string) — value is `"email"` or `"phone"`
- `verified` (boolean)
- `message` (string)
## 10. OTP channel
 
- `otpChannel` (string) — either phone number or email address
## 11. Send OTP response
 
- `channelsSent` (array of OTP channel) — e.g. `["phone"]` for phone only, or `["phone", "email"]` for both
- `message` (string)
## 12. Refresh request
 
*Used for biometric login.*
 
- `refreshToken` (string)
---
See [`data-shapes-savings.md`](./data-shapes-savings.md) for the savings module shapes.


# Savings Module: Data Shapes

The Savings Module is made up of four types of savings accounts: **Regular Savings**, **Kidi Account**, **Education Fund**, and **Purpose Driven**.

All data shapes use **camelCase** naming. Every account type shares a common base shape and a common base create-payload shape, then extends it with type-specific fields.

> **Note on discrepancies with the original spec (from the PRD):** a few fields changed during implementation. These are called out inline below, and summarized in [Changes from the original spec](#changes-from-the-original-spec) at the end ,worth reconciling with the original doc so both stay in sync.

---

## Shared base shapes

### Base Savings Account (shared fields for all account types)

Every stored savings account, regardless of type, has these fields at the top level:

| Field | Type | Notes |
|---|---|---|
| `accountId` | string | Server-generated, unique per account |
| `memberId` | string | Owner of the account |
| `accountNumber` | string | Customer-facing account number |
| `accountType` | string | `regular_account` \| `kidi_account` \| `education_fund` \| `purpose_driven` |
| `accountStatus` | string | `active` \| `matured` \| `closed` \| `frozen` |
| `currentBalance` | integer | **Minor units** (pesewas), e.g. GHS 45.50 → `4550` |
| `currency` | string | e.g. `"GHS"` |
| `interestEarned` | integer | Minor units |
| `autoTransfer` | boolean | Whether scheduled auto-contribution is enabled |
| `createdAt` | ISO8601 string | |
| `updatedAt` | ISO8601 string | |
| `contributionHistory` | array | Array of `ContributionHistoryEntry` |
| `contributorsInformation` | array | Array of `ContributorInformation` |
| `accountDetails` | object | Type-specific fields — shape depends on `accountType` (see below) |

### Base Create Account Payload (shared fields for all create requests)

| Field | Type | Required? | Notes |
|---|---|---|---|
| `initialDeposit` | integer | Optional | Minor units. Omitting it opens the account with a zero balance, to be funded later via a contribution. |
| `autoTransfer` | boolean | **Required** | Always has a value from the form (defaults to `false`), so it's not optional in the payload even though the user isn't forced to toggle it. |

---

## Account Details shapes

Each account type has its own `accountDetails` shape, both for the stored account object and (with the base payload fields added) for the create-request payload.

### Regular Savings Account

**`accountDetails` (stored):**

| Field | Type | Notes |
|---|---|---|
| `isPrimary` | boolean, optional | Only one account across all types can be primary at a time. Setting a new account as primary automatically un-sets any other. |

**Create payload** (`CreateRegularAccountPayload`, extends base payload):

| Field | Type | Required? |
|---|---|---|
| `isPrimary` | boolean | Optional |

### Kidi Account

**`accountDetails` (stored):**

| Field | Type | Notes |
|---|---|---|
| `childId` | string | **Server-generated.** Never sent by the client — the backend creates/links the child record and returns this. Exists so a child can later have their own profile (photo, DOB, multiple linked accounts) without breaking the schema. |
| `childName` | string | Denormalized display field, entered by the user on the form. |
| `maturityDate` | ISO8601 string | |

**Create payload** (`CreateKidiAccountPayload`, extends base payload):

| Field | Type | Required? |
|---|---|---|
| `childName` | string | Required |
| `maturityDate` | ISO8601 string | Required |

> **Change from original spec:** `nextTransferDate` and `nextTransferAmount` were removed from both the stored shape and the payload. Kidi accounts now fund via `initialDeposit` (inherited from the base payload) rather than a dedicated transfer schedule.

### Education Fund Account

**`accountDetails` (stored):**

| Field | Type | Notes |
|---|---|---|
| `goalName` | string | |
| `targetAmount` | integer | Minor units |
| `progressPercentage` | integer | **Server-computed** (`currentAmount / targetAmount`) — never sent on create |
| `maturityDate` | ISO8601 string | |

**Create payload** (`CreateEducationFundPayload`, extends base payload):

| Field | Type | Required? |
|---|---|---|
| `goalName` | string | Required |
| `targetAmount` | integer | Required |
| `maturityDate` | ISO8601 string | Required |

### Purpose-Driven Account

Identical shape to Education Fund — same fields, same rules:

**`accountDetails` (stored):** `goalName`, `targetAmount`, `progressPercentage` (server-computed), `maturityDate`.

**Create payload** (`CreatePurposeDrivenPayload`, extends base payload): `goalName`, `targetAmount`, `maturityDate` — all required.

---

## Supporting shapes

### Contributor's Information

| Field | Type |
|---|---|
| `contributorId` | string |
| `contributorsName` | string |
| `relationshipToChild` | string |
| `amountContributed` | integer (minor units) |
| `dateOfContribution` | ISO8601 string |

### Contribution History (single entry)

| Field | Type |
|---|---|
| `contributionDate` | ISO8601 string |
| `amountContributed` | integer (minor units) |

---

## Response shapes

All responses share a standard envelope:

```json
{
  "status": "success" | "error",
  "data": { ... }
}
```

### Single account response

`data` contains one account object, shaped per the [Base Savings Account](#base-savings-account-shared-fields-for-all-account-types) + type-specific `accountDetails`.

### All accounts for a member

`data` contains:

| Field | Type |
|---|---|
| `accounts` | array of account objects |

No pagination — a member's account list is small enough (bounded by how many accounts they open) that it doesn't need it.

### Contribution history

`data` contains:

| Field | Type |
|---|---|
| `contributions` | array of `ContributionHistoryEntry` |
| `pagination.page` | integer |
| `pagination.pageSize` | integer |
| `pagination.totalCount` | integer |

Pagination applies **only** to contribution history — it's the one list on this module that can genuinely grow large over time.

---

## Design decisions worth knowing

- **Minor units everywhere.** `currentBalance`, `interestEarned`, `targetAmount`, `initialDeposit`, and `amountContributed` are all integers representing minor currency units (pesewas for GHS), never decimals. Conversion to/from major units (e.g. `/ 100` for display, `* 100` for input) happens only at the UI boundary — never in stored data or mid-calculation.
- **One account per member per type, for now** — enforced server-side only. The frontend never filters or restricts account-type selection, so if this rule changes later (e.g. allowing multiple Regular accounts), it's a backend-only change.
- **`isPrimary` is scoped only to Regular Savings** — not a universal field, since "primary account" isn't a meaningful concept for goal-based or child accounts.
- **`autoTransfer` toggling a contribution schedule doesn't yet have payment integration built.** Enabling it currently just stores the preference; the actual recurring charge (MoMo, card, etc.) is a separate, not-yet-built feature.

---

## Changes from the original spec

| Area | Original spec | Current implementation | Needs reconciling? |
|---|---|---|---|
| `accountType` casing | `regularAccount` / `kidiAccount` / `educationFund` / `purposeDriven` (camelCase) | `regular_account` / `kidi_account` / `education_fund` / `purpose_driven` (snake_case) | **Yes** — pick one convention and update whichever side is wrong. |
| Kidi transfer fields | `nextTransferDate`, `nextTransferAmount` on Kidi | Removed entirely; Kidi now uses `initialDeposit` like every other type | Documented here, not yet reflected in the original spec doc. |
| `autoTransfer` in base payload | Not marked required/optional | Required (always has a value from the form) | Minor — spec didn't specify, implementation clarifies it. |
| Contribution history response field name | `contributionHistory` | `contributions` | **Yes** — pick one, currently inconsistent between spec and code. |
| Pagination field names | `pageNumber` | `page` | **Yes** — same issue, needs alignment. |
| `targetAmount` input (UI) | Not specified | Plain number input, not the amount-input-with-presets component (that's reserved for deposit/contribution amounts) | UI-only decision, not a data shape change. |