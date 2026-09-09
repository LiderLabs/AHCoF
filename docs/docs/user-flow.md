# User Flow  
This documentation describes the user(member) flow for each feature in the application. 


## Authentication(new user) 
A new user will be presented with onboarding screens(skippable) that lead to creating an account(signup).  
  
In the sign up process, the user verifies their email or phone number via OTP. Successful verification creates a new user account. First sucessful login leads to biometric set up prompt, the user can login with their biometrics after that.



## Authentication(existing user)
An existing user will see the login form right after the splash screen. The user may login with their email or phone number or biometric login(if set up).   

## Savings Module

The Savings Module lets a member open and manage multiple types of savings accounts: Regular Savings, Kidi Account, Education Fund, and Purpose Driven.

### Viewing the Savings Module

A member accesses the Savings Module from the the dashboard's quick actions. If the member has no savings accounts yet, the page shows an empty state explaining what the module does, along with a button to create their first account. If the member already has one or more accounts, each appears as a card showing its balance and key details. A floating action button, always present in the bottom-right corner of the screen, lets the member create a new savings account at any time, regardless of how many accounts they already have.

### Creating a savings account

Tapping the floating action button (or the empty state's call-to-action) opens a modal where the member chooses which type of account to open: Regular Savings, Kidi Account, Education Fund, or Purpose Driven. All four options are always available, since a member may hold more than one account of the same type.

Selecting a type takes the member to a dedicated form for that account:

- **Regular Savings** — the member may optionally set the new account as their primary account and enable auto-transfer. Setting an account as primary automatically removes primary status from any other account, since only one account can be primary at a time.
- **Kidi Account** — the member enters the child's name, a transfer amount, the date of the next transfer, and a maturity date, and may enable auto-transfer.
- **Education Fund** — the member names the goal, sets a target amount and a maturity date, and may enable auto-transfer.
- **Purpose Driven** — the member names the goal, sets a target amount and a maturity date, and may enable auto-transfer.

Submitting the form creates the account and returns the member to the Savings Module page, where the new account now appears as a card.

### Viewing account details

Tapping an account card takes the member to that account's details page, showing its balance, contribution history, and progress toward its goal where applicable. From here, the member can add a contribution to the account or view its full transaction history.

