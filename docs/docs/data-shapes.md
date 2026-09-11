# AHCoF Data Shapes — Overview

**Simple version:** this file is a checklist. It shows every part of the app that needs a "data shape" (a defined structure for what fields an object has). Items in **bold** are already done.

## 1. Where data shapes are needed

1. Member (maybe the type of member matters)
2. Loans module
3. Notification
4. Shares
5. Dividend
6. Portfolio summary
7. Recent activities
8. **Savings module** (has types: regular, purpose-driven, kidi)
9. Forms (we have different types of forms)
10. Deposit & withdrawals
11. Transaction history
12. **Account**
13. **Contributor's information**
14. **Login / Sign up**
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

## 2. Where the details live

- Auth, member, and account shapes → [`data-shapes-core.md`](./data-shapes-core.md)
- Savings module shapes (all 4 account types) → [`data-shapes-savings.md`](./data-shapes-savings.md)