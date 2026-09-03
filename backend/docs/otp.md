## OTP — signup verification and password reset

Confirmed design: OTP is used **only** for signup verification and password
reset. Login is always identifier + password, no OTP — the session dies on
app exit (Stanbic-style) and re-entry is password-only. This was chosen
specifically because the target users (retirees, less digitally-familiar
members) shouldn't need a fresh SMS/email every time they reopen the app.

### How a code is generated and checked

A single 6-digit numeric code (`OTP_LENGTH`, `OTP_EXPIRE_MINUTES=5` by
default) is generated once per action in `app/modules/otp/service.py`, using
`secrets.randbelow` (cryptographically random, not `random`). Its hash —
using the same `pwdlib`/Argon2 scheme as passwords, via `hash_password`/
`verify_password` in `core/security.py` — is stored in the new `otp_codes`
table. The plaintext code is never persisted; it only exists in memory long
enough to hand to the sender functions.

`otp_codes` is a standalone table (not columns bolted onto `members`)
because both signup-verification and password-reset codes need to coexist
and have separate history — a member requesting a second password reset
shouldn't invalidate an unrelated pending signup verification, or vice
versa. `purpose` distinguishes them (`OtpPurpose.SIGNUP_VERIFICATION` /
`OtpPurpose.PASSWORD_RESET`); verification always checks the most recent
*unconsumed* code for that member+purpose, so requesting a new code makes
an older one moot even before it expires.

### Why not Arkesel's own OTP API

Arkesel has a dedicated `/otp/send` + `/otp/verify` pair that generates and
verifies the code entirely on their side. Deliberately not using it: when a
member has both a phone and an email on file, the same code needs to reach
both channels, and Resend (used for email) has no equivalent stateful OTP
product. Letting Arkesel generate its own code would mean two different
codes for one verification action. Generating the code ourselves once and
using Arkesel's plain `/sms/send` endpoint plus Resend's plain `/emails`
endpoint as dumb delivery channels keeps one code, one verification path,
regardless of which channel(s) a member has.

### Delivery — `app/modules/otp/senders.py`

- **SMS (Arkesel):** `POST https://sms.arkesel.com/api/v2/sms/send`, `api-key`
  header, JSON body with `sender`/`message`/`recipients`. Always attempted —
  phone number is a required field on every member.
- **Email (Resend):** `POST https://api.resend.com/emails`, `Authorization:
  Bearer <key>` header, JSON body with `from`/`to`/`subject`/`html`. Only
  attempted if the member has an email address on file.
- **Demo mode:** if `settings.demo_mode` is true (the project default) or
  the relevant API key isn't set, the sender logs the message instead of
  making a real HTTP call. This is required for CI and local dev to work
  without real (paid, for SMS) provider credentials — tests patch
  `send_otp_to_member` directly to capture the code rather than relying on
  demo-mode logging, since log output isn't a clean thing to assert on.

**Known cost/limitation, not yet resolved:** Arkesel has no sustained free
SMS tier (documented in the earlier OTP research this session) — real SMS
sends cost real GHS once `ARKESEL_API_KEY` is actually set. Resend's
`onboarding@resend.dev` sender only delivers to the Resend account owner's
own verified email until a custom domain is verified on the Resend account
— fine for one developer's own testing, not for testing with real member
emails until a domain is verified.

### Endpoints — all in `app/modules/auth/router.py`

- **`POST /auth/register`** — unchanged request/response shape, but now
  also generates and sends a signup OTP as a side effect. The member can
  log in immediately; `isVerified` starts `false`.
- **`POST /auth/verify-signup-otp`** `{identifier, code}` → sets
  `isVerified: true`. `404 MEMBER_NOT_FOUND` if the identifier doesn't
  match anyone (registering just happened, so there's no real enumeration
  risk here worth trading against a clearer error).
- **`POST /auth/forgot-password`** `{identifier}` → sends a reset OTP to
  whichever channels are on file. **Always returns the same generic
  message**, whether or not the identifier matches a member — this
  endpoint must never be usable to check which phone numbers/emails are
  registered.
- **`POST /auth/reset-password`** `{identifier, code, newPassword}` →
  verifies the code and updates the password hash. An unknown identifier
  here returns the same `400 INVALID_OTP` as a wrong code, for the same
  enumeration-prevention reason as forgot-password.

### New error codes

`400 INVALID_OTP` (wrong code, already-consumed code, or no pending code at
all) and `400 OTP_EXPIRED` (right code, but past `expires_at`) — both in
`core/exceptions.py`.

### Does verification gate login?

**No, by design decision this session.** Registering logs the member in
immediately with a valid access token; `isVerified` is informational until
something is built that actually depends on it (e.g. blocking a sensitive
action for unverified members). This was chosen over blocking login on
missed/lost OTPs specifically because of the target user base — locking a
retiree out of the app entirely over a delivery failure is a worse outcome
than a temporarily-unverified account. Revisit if requirements change.

### Known gaps / not built yet

- No rate limiting on `/forgot-password` or `/verify-signup-otp` — someone
  could hammer either endpoint. Not addressed this session.
- No resend-OTP endpoint — a member who doesn't receive the code has no way
  to request a new one except registering again (signup) or calling
  `/forgot-password` again (reset), which does correctly issue a fresh code
  each time it's called, but there's no dedicated "resend" affordance yet.
- `attempt_count` is tracked on `OtpCode` but nothing currently acts on it
  (no lockout after N wrong attempts).