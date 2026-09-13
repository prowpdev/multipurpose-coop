# Cooperative Management System (CoopFlex)

A full-stack, configuration-driven cooperative ERP platform built with React, TypeScript, Express, and Vite.

## Quick Start (Running Locally)

### Prerequisites
- **Node.js**: version 18+ (Node 20 or 22 recommended)
- **npm** (comes with Node.js)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
This runs `tsx server.ts`, which boots the unified full-stack server on `http://localhost:3000`:
- **Frontend SPA**: Handled directly through Vite middleware with instant Hot Module Replacement support.
- **Backend API**: Mounted on `/api` (e.g. `http://localhost:3000/api/health`).

Open your browser and navigate to:
```
http://localhost:3000
```

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the unified full-stack server (Vite + Express on port 3000) |
| `npm run dev:server` | Starts the standalone backend from `server/server.ts` |
| `npm run build` | Compiles client assets (`dist/`) and bundles backend (`dist/server.cjs`) |
| `npm start` | Runs the production-built application via `node dist/server.cjs` |
| `npm run lint` | Type-checks the entire TypeScript codebase (`tsc --noEmit`) |

---

## Project Structure

```
├── server.ts                       # Main application entry point (root)
├── server/
│   ├── server.ts                   # Dedicated server runner
│   ├── index.ts                    # Server module exports
│   ├── db/
│   │   ├── database.ts             # JSON file-persisted ACID database engine
│   │   ├── seed.ts                 # Factory default standard CDA Chart of Accounts & seeds
│   │   └── sampleData.ts           # Realistic cooperative testing dataset
│   ├── routes/
│   │   └── api.ts                  # REST API endpoints (/api/members, /api/loans, etc.)
│   └── services/                   # Modular backend business logic services
│       ├── accountingEngine.ts     # Double-entry posting & voucher generation
│       ├── authService.ts          # Authentication, user roles & session permissions
│       ├── configService.ts        # Master parameters & product versioning
│       ├── interestCalculationService.ts # Flat rate, diminishing balance, amortization
│       ├── loanService.ts          # Loan origination, scheduling & repayments
│       ├── memberService.ts        # Member profiles, custom fields & numbers
│       ├── numberingService.ts     # Configurable document & voucher sequences
│       ├── paymentAllocationService.ts # Waterfall payment priority distributor
│       ├── reportService.ts        # Trial Balance, Balance Sheet, Income Statement
│       ├── savingsService.ts       # Accounts, deposits, withdrawals & maintaining balances
│       ├── shareCapitalService.ts  # Subscribed & paid-up share capital, OR tracking
│       └── index.ts                # Central barrel export for all services
├── src/                            # Frontend React 19 application
│   ├── components/                 # UI Modules (Loans, Accounting, Members, Setup Wizard)
│   ├── services/api.ts             # Unified frontend API client (defaults to /api)
│   ├── types.ts                    # Shared TypeScript interfaces
│   ├── App.tsx                     # Main layout & route navigation
│   └── main.tsx                    # React client entry point
├── package.json
└── vite.config.ts
```

---

## Backend Services Overview (`server/services/`)

All backend business logic is extracted into modular service classes in `server/services`:

- **`MemberService`**: Member onboarding, profile updates, member ID generation, and member financial balance compilations.
- **`LoanService`**: Dynamic amortization schedule calculations, loan origination with fee deductions, automated repayment allocations, and voucher postings.
- **`SavingsService`**: Opening regular savings and time deposit accounts, balance validation, and deposit/withdrawal processing with GL integration.
- **`ShareCapitalService`**: Subscription handling, paid-up share contributions, and Official Receipt issuance.
- **`AccountingEngine`**: Core double-entry bookkeeping engine that validates debits equal credits before posting journal vouchers.
- **`PaymentAllocationService`**: Dynamic priority distributor allocating payments across penalties, interest, fees, and principal.
- **`InterestCalculationService`**: Mathematical engine supporting Diminishing Balance, Flat Rate, and Simple Interest schedules.
- **`NumberingService`**: Pattern-based sequence generator for member IDs, loan accounts, savings accounts, and vouchers.
- **`ReportService`**: Compiles balanced Trial Balance reports, Statements of Financial Condition (Balance Sheet), and Statements of Operations (Income Statement).
- **`AuthService`**: User credential validation, role-based access control (RBAC), and session security.
- **`ConfigService`**: Configuration center management, parameter persistence, and loan product versioning.
