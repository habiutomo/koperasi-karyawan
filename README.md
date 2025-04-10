# Koperasi Karyawan - Employee Cooperative Management System

A comprehensive web-based management system for employee cooperatives (Koperasi Karyawan) with savings and loans management capabilities.

## Features

- **Member Management:** Add, view, and manage cooperative members including their personal and employment information.
- **Savings Management:** Track member savings accounts with deposit and withdrawal transactions.
- **Loan Processing:** Manage loan applications, approvals, repayments, and track loan status.
- **Dividend Distribution:** Calculate and distribute dividends to members based on their contributions.
- **Task Management:** Assign and track tasks related to cooperative operations.
- **Reports and Analytics:** Generate reports and view analytics on membership, savings, loans, and financial performance.
- **User Authentication:** Secure login and role-based access control for administrators and staff.

## Technology Stack

- **Frontend:** React with Typescript, TailwindCSS, Shadcn UI components
- **Backend:** Node.js with Express
- **Database:** PostgreSQL with Drizzle ORM
- **State Management:** TanStack Query for server state, React Context for application state
- **Routing:** Wouter for frontend routing
- **Form Validation:** React Hook Form with Zod validation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/koperasi-karyawan.git
cd koperasi-karyawan
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/koperasi
SESSION_SECRET=your_secret_key
```

4. Start the development server:
```bash
npm run dev
```

5. The application will be available at `http://localhost:3000`

## System Structure

- **Member Management:** Tracks personal information, employment details, and membership status.
- **Savings Module:** Manages three types of savings:
  - **Simpanan Pokok (Principal Savings):** One-time payment when joining the cooperative.
  - **Simpanan Wajib (Mandatory Savings):** Regular monthly contributions.
  - **Simpanan Sukarela (Voluntary Savings):** Optional additional savings with competitive interest.
- **Loan Management:** Processes member loan applications with configurable terms, interest rates, and repayment tracking.
- **Dividend System:** Calculates and distributes profits to members based on their savings and contribution.

## Default Credentials

Use these credentials to log in to the system:

**Username:** admin  
**Password:** admin123

## License

This project is licensed under the MIT License - see the LICENSE file for details.