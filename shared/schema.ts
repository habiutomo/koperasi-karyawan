import { pgTable, text, serial, integer, boolean, timestamp, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role").default("member").notNull(),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true,
  avatar: true,
});

// Member status enum
export const memberStatusEnum = pgEnum("member_status", [
  "active",
  "inactive",
  "new",
  "on_leave",
]);

// Members schema
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  employeeId: text("employee_id").notNull().unique(),
  department: text("department").notNull(),
  position: text("position").notNull(),
  joinDate: timestamp("join_date").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  status: text("status", { enum: ["active", "inactive", "new", "on_leave"] }).default("new").notNull(),
  monthlyContribution: real("monthly_contribution").default(0).notNull(),
});

export const insertMemberSchema = createInsertSchema(members).pick({
  userId: true,
  employeeId: true,
  department: true,
  position: true,
  joinDate: true,
  phoneNumber: true,
  address: true,
  status: true,
  monthlyContribution: true,
});

// Transaction type enum
export const transactionTypeEnum = pgEnum("transaction_type", [
  "deposit",
  "withdrawal",
  "loan_disbursement",
  "loan_repayment",
  "dividend_payment",
]);

// Transaction status enum
export const transactionStatusEnum = pgEnum("transaction_status", [
  "completed",
  "pending",
  "cancelled",
  "failed",
]);

// Transactions schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  type: text("type", { enum: ["deposit", "withdrawal", "loan_disbursement", "loan_repayment", "dividend_payment"] }).notNull(),
  amount: real("amount").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  description: text("description"),
  status: text("status", { enum: ["completed", "pending", "cancelled", "failed"] }).default("pending").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  memberId: true,
  type: true,
  amount: true,
  date: true,
  description: true,
  status: true,
});

// Savings schema
export const savings = pgTable("savings", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  totalSavings: real("total_savings").default(0).notNull(),
  lastUpdate: timestamp("last_update").defaultNow().notNull(),
});

export const insertSavingsSchema = createInsertSchema(savings).pick({
  memberId: true,
  totalSavings: true,
  lastUpdate: true,
});

// Loan status enum
export const loanStatusEnum = pgEnum("loan_status", [
  "pending",
  "approved",
  "rejected",
  "active",
  "completed",
  "defaulted",
]);

// Loans schema
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  amount: real("amount").notNull(),
  interestRate: real("interest_rate").notNull(),
  term: integer("term").notNull(), // in months
  purpose: text("purpose").notNull(),
  applicationDate: timestamp("application_date").defaultNow().notNull(),
  approvalDate: timestamp("approval_date"),
  status: text("status", { enum: ["pending", "approved", "rejected", "active", "completed", "defaulted"] }).default("pending").notNull(),
  totalRepaid: real("total_repaid").default(0).notNull(),
  nextPaymentDue: timestamp("next_payment_due"),
  monthlyPayment: real("monthly_payment"),
});

export const insertLoanSchema = createInsertSchema(loans).pick({
  memberId: true,
  amount: true,
  interestRate: true,
  term: true,
  purpose: true,
  applicationDate: true,
  approvalDate: true,
  status: true,
  totalRepaid: true,
  nextPaymentDue: true,
  monthlyPayment: true,
});

// Dividends schema
export const dividends = pgTable("dividends", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  totalAmount: real("total_amount").notNull(),
  distributionDate: timestamp("distribution_date").notNull(),
  description: text("description"),
});

export const insertDividendSchema = createInsertSchema(dividends).pick({
  year: true,
  month: true,
  totalAmount: true,
  distributionDate: true,
  description: true,
});

// Dividend distributions schema
export const dividendDistributions = pgTable("dividend_distributions", {
  id: serial("id").primaryKey(),
  dividendId: integer("dividend_id").notNull(),
  memberId: integer("member_id").notNull(),
  amount: real("amount").notNull(),
  distributionDate: timestamp("distribution_date").defaultNow().notNull(),
  status: text("status", { enum: ["completed", "pending", "failed"] }).default("pending").notNull(),
});

export const insertDividendDistributionSchema = createInsertSchema(dividendDistributions).pick({
  dividendId: true,
  memberId: true,
  amount: true,
  distributionDate: true,
  status: true,
});

// Task status enum
export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "in_progress",
  "completed",
]);

// Tasks schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  status: text("status", { enum: ["pending", "in_progress", "completed"] }).default("pending").notNull(),
  assignedToUserId: integer("assigned_to_user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  dueDate: timestamp("due_date"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  type: true,
  status: true,
  assignedToUserId: true,
  createdAt: true,
  dueDate: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Saving = typeof savings.$inferSelect;
export type InsertSaving = z.infer<typeof insertSavingsSchema>;

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

export type Dividend = typeof dividends.$inferSelect;
export type InsertDividend = z.infer<typeof insertDividendSchema>;

export type DividendDistribution = typeof dividendDistributions.$inferSelect;
export type InsertDividendDistribution = z.infer<typeof insertDividendDistributionSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
