# Project Status

A running snapshot of what's built, what's in progress, and what hasn't been started yet. Update this as work progresses, it's meant to give anyone (including future you) an honest, quick read on where things stand.

_Last updated: check git blame / commit history for this file's most recent edit._

---

## Complete

### Authentication
- Splash page
- Login and signup
- Onboarding pages

### Savings Module
- All pages exist: Savings screen, account details page, account-type picker modal

### General
- All pages from the wireframes have been created; some have been modified along the way as requirements shifted during build

---

## Partial

### Authentication
- **OTP**: pages are built, but waiting on backend integration. Still needs: OTP code countdown/resend timer, general UI polish.
- **Biometric login**: pages exist, but not yet wired into actual navigation/routing.

### Savings Module
- Account creation is blocked on the backend, the frontend flow (form → submit → navigate back) is complete, but no account can actually be created end-to-end until the backend endpoints are live.

### Dashboard
- New-user view: carousel showing savings/loans account options, not yet built.
- Existing-user view: portfolio summary, matching current Figma wireframes, not yet built.
- Forms center: pages exist but have no functionality wired up yet.

---

## Not Started

- **Loans module**: no work begun.
- **Withdrawal and deposit**: API layer and logic not started.
- **Repay screen**: for repaying loans.
- **Shares and dividend functionality**.

---

## Notes

- Additional features may require new pages, screens, or components beyond what currently exists from the wireframes, this list isn't necessarily final in scope.
- "Partial" items are the most likely next things to pick up, since the frontend groundwork already exists for most of them, they're blocked on backend work or missing wiring, not missing design/build effort.