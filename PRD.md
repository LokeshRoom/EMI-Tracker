# EMI Tracker Product Requirements

## Objective
Build and deploy a Next.js finance app on Google Firebase to track credit cards, cardholders, EMI purchases, outstanding balances, and EMI-related costs.

## Problem
The user has multiple credit cards, often shared with others. The main pain point is losing track of EMI purchases made by others and the total cost of each EMI, including interest, processing charges, additional costs, and GST.

## Core Features
- Create and manage credit cards.
- Track cardholders associated with each card.
- Record EMI purchases made by a cardholder.
- Calculate EMI using standard reducing-balance amortization.
- Display monthly EMI schedule.
- Calculate total EMI cost, interest, processing charges, additional costs, and GST.
- Show dashboard totals for outstanding balance, monthly EMI commitment, total interest, and GST.
- Support multiple shared cards with Firebase Auth access control.

## Confirmed Business Rules
- EMI calculation uses standard reducing-balance amortization.
- Interest rate is entered as an annual percentage rate.
- Monthly rate is calculated as `annualInterestRatePercent / 100 / 12`.
- Down payment is tracked separately and does not reduce the EMI principal.
- Down payment is included in total user outlay.
- Additional cost is a fixed amount.
- Additional cost can be one-time or monthly.
- GST is 18% on interest components.
- GST is 18% on initial processing charges.
- GST is 18% on additional costs.
- Store only card label and last 4 digits.
- Do not store full card number, CVV, PIN, or card verification code.

## Technology Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Auth
- Firebase Firestore
- Firebase Hosting
- Zod
- React Hook Form
- Decimal-safe money calculations
- Vitest

## Data Model

### users/{uid}
```text
displayName
email
createdAt
updatedAt
```

### cards/{cardId}
```text
bankName
cardLabel
last4
currency
creditLimit?
outstandingBalance
ownerUid
userIds[]
createdAt
updatedAt
```

### cards/{cardId}/cardholders/{cardholderId}
```text
name
phone?
email?
createdAt
updatedAt
```

### cards/{cardId}/emis/{emiId}
```text
cardholderId
merchantName
purchaseDate
principalAmount
downPayment
interestRateAnnual
tenureMonths
startMonth
processingCharge
additionalCostAmount
additionalCostFrequency: "one_time" | "monthly"
status: "active" | "closed"
createdAt
updatedAt
```

## EMI Calculation

Inputs:
```text
principal
annualInterestRatePercent
tenureMonths
```

Derived monthly rate:
```text
monthlyRate = annualInterestRatePercent / 100 / 12
```

EMI formula:
```text
EMI = principal × monthlyRate × (1 + monthlyRate)^tenure /
      ((1 + monthlyRate)^tenure - 1)
```

If monthly rate is zero:
```text
EMI = principal / tenure
```

Totals:
```text
totalEmiPaid = EMI × tenure
totalInterest = totalEmiPaid - principal
```

Down payment handling:
```text
EMI principal = principalAmount
Down payment is not subtracted from principalAmount
Down payment is included in total user outlay
```

Additional cost:
```text
If additionalCostFrequency = "one_time":
  totalAdditionalCost = additionalCostAmount

If additionalCostFrequency = "monthly":
  totalAdditionalCost = additionalCostAmount × tenure
```

GST:
```text
gstOnInterest = totalInterest × 18%
gstOnProcessingCharge = processingCharge × 18%
gstOnAdditionalCost = totalAdditionalCost × 18%
```

Total user outlay:
```text
totalOutlay =
  downPayment
  + totalEmiPaid
  + processingCharge
  + gstOnProcessingCharge
  + totalAdditionalCost
  + gstOnAdditionalCost
  + gstOnInterest
```

Monthly schedule should show:
```text
month
opening principal balance
EMI paid
interest component
principal component
closing principal balance
```

## UI Scope

### Auth
- Login page.
- Signup page.
- Auth guard for dashboard pages.

### Dashboard
- Total outstanding balance across cards.
- Total active EMI monthly commitment.
- Total estimated EMI interest.
- Total estimated GST.
- Recent EMIs.
- Cards list.

### Cards
- List accessible cards.
- Create card.
- Edit card.
- View card detail.

Card form fields:
```text
bank name
card label
last 4 digits
currency
credit limit, optional
outstanding balance
authorized user UIDs, optional
```

### Card Detail
- Card summary.
- Outstanding balance.
- Cardholders list.
- EMIs list.
- Add cardholder.
- Add EMI.

### Cardholders
- Add cardholder name.
- Optional phone/email.
- Link cardholder to EMIs.

### EMI Form
```text
cardholder
merchant name
purchase date
principal amount
down payment
annual interest rate
tenure in months
start month
initial processing charge
additional fixed cost amount
additional cost frequency: one-time or monthly
status
```

### EMI Detail
Show:
```text
EMI amount
total EMI paid
total interest
processing charge
GST on processing charge
additional cost
GST on additional cost
GST on interest
total outlay
monthly repayment schedule
```

## Firebase Security
- Users can only read/write their own user profile.
- Cards are accessible only to Firebase users whose UID is in `card.userIds`.
- Cardholders and EMIs are subcollections under the card and inherit card-level access.
- No sensitive card authentication data is stored.

## Deployment
- Use `firebase.json` for Firebase Hosting.
- Use `firestore.rules` for Firestore security rules.
- Store Firebase config in environment variables.
- Do not commit secrets to the repository.

## Verification
Before completion, run:
```text
npm run lint
npm run typecheck
npm test
npm run build
```
