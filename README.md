# EMI Tracker

A Next.js finance app for tracking credit cards, cardholders, and EMI (equated monthly installment) purchases. It calculates each EMI using standard reducing-balance amortization and shows the full cost breakdown — interest, processing charges, additional costs, and GST — so you always know what every installment really costs.

## Features

- **Cards** — create, edit, and view credit cards (bank name, label, last 4 digits, currency, credit limit, outstanding balance).
- **Cardholders** — track people who use each card; EMIs are linked to a cardholder.
- **EMI tracking** — record purchases with principal, down payment, annual interest rate, tenure, start month, processing charge, and additional fixed cost (one-time or monthly).
- **Cost breakdown** — total EMI paid, total interest, GST on interest / processing charge / additional cost, and total user outlay.
- **Monthly schedule** — per-month opening/closing principal balance, EMI paid, interest component, and principal component.
- **Dashboard** — totals for outstanding balance, active monthly EMI commitment, estimated interest, and GST, plus recent EMIs and cards.
- **Shared access** — multiple Firebase users can be authorized on a card; Firestore rules enforce per-card access control.

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Backend / DB | Firebase Data Connect + Firestore |
| Auth | Firebase Authentication |
| Client state | React Query, React Hook Form |
| Validation | Zod |
| Money math | `decimal.js` (decimal-safe calculations) |
| Testing | Vitest |

## Getting Started

### 1. Prerequisites

- Node.js 20+
- A Firebase project with:
  - Authentication enabled
  - Firestore enabled
  - Data Connect configured (see [Data Connect docs](https://firebase.google.com/docs/data-connect))

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain (e.g. `example.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket name |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Web app ID |

> Never commit secrets. `.env` is git-ignored.

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build (output in `out/`) |
| `npm start` | Run the production build |
| `npm run lint` | ESLint checks |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Vitest test suite |

## Data Model

```text
users/{uid}                          displayName, email, createdAt, updatedAt
cards/{cardId}                       bankName, cardLabel, last4, currency, creditLimit?, outstandingBalance, ownerUid, userIds[]
cards/{cardId}/cardholders/{id}     name, phone?, email?
cards/{cardId}/emis/{emiId}          cardholderId, merchantName, purchaseDate, principalAmount, downPayment, interestRateAnnual, tenureMonths, startMonth, processingCharge, additionalCostAmount, additionalCostFrequency, status
```

### EMI calculation

- Monthly rate: `annualInterestRatePercent / 100 / 12`
- Standard reducing-balance amortization (zero-rate fallback: `principal / tenure`)
- Down payment is tracked separately and included in total outlay but **not** subtracted from the EMI principal.
- GST at 18% applies to interest, initial processing charge, and additional costs.

## Security

- Only card label and last 4 digits are stored — no full card number, CVV, PIN, or verification code.
- Firestore rules restrict cards (and their subcollections) to users whose UID is in `card.userIds`.
- Users can only read/write their own profile.

## Deployment

Deploy to Firebase Hosting:

```bash
npm run build
firebase deploy
```

`firebase.json` configures the hosting site (`myemitracker`) with clean URLs and a rewrite to `/index.html`. Firestore rules are deployed from `firestore.rules`.
