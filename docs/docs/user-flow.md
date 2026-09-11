# User Flow

This documentation describes the user (member) flow for each feature in the application.

---

## Authentication (new user)

A new user will be presented with onboarding screens (skippable) that lead to creating an account (signup).

In the sign up process, the user verifies their email or phone number via OTP. Successful verification creates a new user account. First successful login leads to a biometric set-up prompt; the user can log in with their biometrics after that.

**Flow:**
```
Onboarding (skippable) → Signup → OTP verification → Account created → First login → Biometric setup prompt → Home
```

---

## Authentication (existing user)

An existing user will see the login form right after the splash screen. The user may log in with their email or phone number, or via biometric login (if set up).

**Flow:**
```
Splash screen → Login form → Enter email/phone + password, OR biometric login → Home
```

---

## Savings Module

The Savings Module lets a member open and manage multiple types of savings accounts: Regular Savings, Kidi Account, Education Fund, and Purpose Driven.

### Viewing the Savings Module

A member accesses the Savings Module from the dashboard's quick actions. If the member has no savings accounts yet, the page shows an empty state explaining what the module does, along with a button to create their first account. If the member already has one or more accounts, each appears as a card showing its balance and key details. A floating action button, always present in the bottom-right corner of the screen, lets the member create a new savings account at any time, regardless of how many accounts they already have.

**Flow:**
```
Dashboard → Quick Actions → Savings Module
                                  │
                     ┌────────────┴────────────┐
                     ▼                         ▼
              No accounts yet            Has accounts
                     │                         │
              Empty state shown          Account cards shown
                     │                         │
                     └────────────┬────────────┘
                                  ▼
                    Floating "+" button (always visible)
```

### Creating a savings account

Tapping the floating action button (or the empty state's call-to-action) opens a modal where the member chooses which type of account to open: Regular Savings, Kidi Account, Education Fund, or Purpose Driven. All four options are always available, since a member may hold more than one account of the same type.

**Flow:**
```
Tap "+" (or empty state CTA)
        ▼
Account type picker modal opens
        ▼
Member selects a type
        ▼
   ┌────────────┬────────────┬──────────────┬────────────────┐
   ▼            ▼            ▼              ▼                
Regular      Kidi        Education      Purpose Driven
 form        form           form            form
   │            │            │                │
   └────────────┴────────────┴────────────────┘
                       ▼
            Member fills form, submits
                       ▼
           Account created on backend
                       ▼
        Returned to Savings Module page
                       ▼
          New account now appears as a card
```

Each form asks for slightly different fields, but all four share two things: an **initial deposit is optional** (an account can be opened at a zero balance and funded later), and **auto-transfer can be enabled** on creation.

- **Regular Savings** : the member may optionally set the new account as their primary account, set an initial deposit, and enable auto-transfer. Setting an account as primary automatically removes primary status from any other account, since only one account can be primary at a time.

  ```
  Select "Regular Savings" → Form: [isPrimary toggle] [initial deposit, optional] [auto-transfer toggle] → Submit → Created
  ```

- **Kidi Account**: the member enters the child's name and a maturity date, may optionally set an initial deposit, and may enable auto-transfer.

  ```
  Select "Kidi Account" → Form: [child's name] [maturity date] [initial deposit, optional] [auto-transfer toggle] → Submit → Created
  ```

- **Education Fund**: the member names the goal, sets a target amount and a maturity date, may optionally set an initial deposit, and may enable auto-transfer.

  ```
  Select "Education Fund" → Form: [goal name] [target amount] [maturity date] [initial deposit, optional] [auto-transfer toggle] → Submit → Created
  ```

- **Purpose Driven**: the member names the goal, sets a target amount and a maturity date, may optionally set an initial deposit, and may enable auto-transfer.

  ```
  Select "Purpose Driven" → Form: [goal name] [target amount] [maturity date] [initial deposit, optional] [auto-transfer toggle] → Submit → Created
  ```

### Viewing account details

Tapping an account card takes the member to that account's details page, showing the account number, status, current balance, account type, and interest earned. From here, the member can schedule a transfer into the account, add a contribution, or view the account's full transaction history.

**Flow:**
```
Tap account card
        ▼
Account details page
        │
   ┌────┴──────────────────────┬────────────────────────┐
   ▼                           ▼                         ▼
Schedule a transfer      Add a contribution         View history
   │                           │                         │
[one-time OR recurring]  [not yet implemented]     [not yet implemented]
[amount, date, and
 frequency if recurring]
```

> **Not yet implemented:** "Add a contribution" and "View history" are visible on the account details page but not yet functional — both are pending payment-provider integration (e.g. MoMo) and, for history, the paginated contribution-history endpoint.
>
> **Scheduling a transfer** supports both a one-time, future-dated transfer and a recurring transfer (weekly or monthly), chosen by the member at the point of scheduling.