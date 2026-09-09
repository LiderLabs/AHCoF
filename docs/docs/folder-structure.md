# Frontend Folder Structure

This document explains how the `frontend/` app is actually organized. It's meant to help developers and engineers working on this project find things fast.


## Quick Summary

- We use a **feature-based structure**: code is grouped by what it does (e.g. "loans"), not by file type.
- **Expo Router** (`app/`) handles navigation only, each file is a route.
- **`src/`** holds the real logic: one folder per feature, plus shared code used everywhere.
- Inside each feature: **`components/`** = small reusable pieces, **`screens/`** = full pages.

---

## 1. Top-Level Layout

```
frontend/
├── .claude/
├── .expo/
├── android/
├── app/            # Expo Router - routes only
├── assets/         # Images, fonts, icons
├── docs/           # Project documentation (this file lives here)
├── ios/
├── node_modules/
├── src/            # All feature code and shared code
├── .env
├── .gitignore
├── app.json
├── babel.config.js
├── eas.json
├── global.css
├── index.ts
├── LICENSE
├── metro.config.js
├── nativewind-env.d.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 2. `app/` - Routing Layer (Expo Router)

**What this is:** Expo Router turns each file here into a real screen/route. Files stay thin and they import the actual component from `src/features/`.

```
app/
├── (auth)/
├── (forms)/
├── (onboarding)/
├── (tabs)/
│   ├── explore.tsx
│   ├── more.tsx
│   ├── portfolio.tsx
│   └── profile.tsx
├── deposit/
├── loans/
├── otp/
├── savings/
├── shares/
├── withdraw/
├── _layout.tsx      # root layout (fonts, providers, etc.)
└── index.tsx
```

**Notes:**
- Folders in parentheses — `(auth)`, `(forms)`, `(onboarding)`, `(tabs)` — group routes without adding to the URL. Purely organizational.
- `deposit/`, `withdraw/`, `loans/`, `savings/`, `shares/`, `otp/` are top-level routes, not nested inside a shared "mobile-money" route.

---

## 3. `src/features/` — Feature Code

**What this is:** One folder per app feature. Each is self-contained.

**Pattern used inside a feature folder:**
| Folder/file | What goes here |
|---|---|
| `components/` | Small reusable UI pieces used only by this feature |
| `screens/` | Full pages (what a route in `app/` renders) |
| `api/` | Functions that call the backend for this feature |
| `context/` | React Context, if the feature needs shared state (e.g. auth) |
| `utils/` | Feature-specific helper functions |
| `types.ts` | TypeScript shapes for this feature's data |

Not every feature needs all of these so skip what isn't used.

```
src/features/
├── auth/
│   ├── api/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── screens/
│   │   ├── BiometricSetupScreen.tsx
│   │   ├── BiometricUnlockScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── OtpVerificationScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   └── SplashScreen.tsx
│   ├── utils/
│   ├── schema.ts
│   ├── types.ts
│   └── validation.ts
│
├── dashboard/
├── forms/
├── loans/
├── mobile-money/
├── notifications/
├── onboarding/
├── profile/
│
├── savings/
│   ├── components/
│   ├── screens/
│   └── types.ts
│
└── shares/
```

*(`loans`, `mobile-money`, `notifications`, `onboarding`, `profile`, `shares`, `dashboard`, `digital-forms`, and `forms` follow the same pattern as `auth`/`savings` above )*

---

## 4. `src/` - Shared Code

**What this is:** Code used by more than one feature, so it's not duplicated inside each feature folder.

```
src/
├── components/
│   ├── states/       # empty/loading/error state components
│   └── ui/            # Button, Card, Input, Header, etc.
├── constants/
│   ├── colors.ts
│   ├── membershipTypes.ts
│   ├── mobileMoneyProviders.ts
│   └── navItems.tsx
├── features/           # see section 3
├── hooks/               # shared hooks, e.g. useAuth
├── lib/                  # API client setup, token storage
├── services/             # backend-facing service logic
├── store/                # app-wide state management
├── types/                # shared types, e.g. Member
└── utils/                # formatters, validators, helpers
```

`components/ui/` currently holds: `ActionTile`, `AlertBanner`, `AmountInput`, `BackButton`, `BottomNav`, `Button`, `Card`, `ConfirmationModal`, `FormLayout`, `Header`, `Input`, `ListItem`, `Logo`, `NotificationBadgeIcon`, `SectionHeader`, `SelectableRow`, `SelectableTile`, `SplitStatCard`, `StepIndicator`, `SummaryCard`, `TipBanner`, `TransactionHeader`, `TransactionSuccessScreen`.

---

## 5. Full Picture

```
frontend/
├── app/
│   ├── (auth)/
│   ├── (forms)/
│   ├── (onboarding)/
│   ├── (tabs)/
│   ├── deposit/
│   ├── loans/
│   ├── otp/
│   ├── savings/
│   ├── shares/
│   ├── withdraw/
│   ├── _layout.tsx
│   └── index.tsx
│
├── src/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── digital-forms/
│   │   ├── forms/
│   │   ├── loans/
│   │   ├── mobile-money/
│   │   ├── notifications/
│   │   ├── onboarding/
│   │   ├── profile/
│   │   ├── savings/
│   │   └── shares/
│   │
│   ├── components/
│   │   ├── states/
│   │   └── ui/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
│
├── assets/
├── docs/
├── app.json
├── package.json
└── tsconfig.json
```

## Rule of Thumb When Adding New Code

1. **Is it a screen?** → goes in `app/`, keep it thin.
2. **Is it a full page for one feature?** → goes in that feature's `screens/`.
3. **Is it a small piece used only by one feature?** → goes in that feature's `components/`.
4. **Is it used by 2+ features?** → goes in the shared `src/` folders.
