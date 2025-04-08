import { 
  users, type User, type InsertUser,
  members, type Member, type InsertMember,
  transactions, type Transaction, type InsertTransaction,
  savings, type Saving, type InsertSaving,
  loans, type Loan, type InsertLoan,
  dividends, type Dividend, type InsertDividend,
  dividendDistributions, type DividendDistribution, type InsertDividendDistribution,
  tasks, type Task, type InsertTask
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Member operations
  getMember(id: number): Promise<Member | undefined>;
  getMemberByUserId(userId: number): Promise<Member | undefined>;
  getMemberByEmployeeId(employeeId: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  getMembersByStatus(status: string): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, memberData: Partial<Member>): Promise<Member | undefined>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByMemberId(memberId: number): Promise<Transaction[]>;
  getRecentTransactions(limit: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Savings operations
  getSaving(id: number): Promise<Saving | undefined>;
  getSavingByMemberId(memberId: number): Promise<Saving | undefined>;
  getAllSavings(): Promise<Saving[]>;
  createSaving(saving: InsertSaving): Promise<Saving>;
  updateSaving(id: number, savingData: Partial<Saving>): Promise<Saving | undefined>;
  
  // Loan operations
  getLoan(id: number): Promise<Loan | undefined>;
  getLoansByMemberId(memberId: number): Promise<Loan[]>;
  getLoansByStatus(status: string): Promise<Loan[]>;
  getActiveLoans(): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoan(id: number, loanData: Partial<Loan>): Promise<Loan | undefined>;
  
  // Dividend operations
  getDividend(id: number): Promise<Dividend | undefined>;
  getAllDividends(): Promise<Dividend[]>;
  getLatestDividend(): Promise<Dividend | undefined>;
  createDividend(dividend: InsertDividend): Promise<Dividend>;
  
  // Dividend distribution operations
  getDividendDistribution(id: number): Promise<DividendDistribution | undefined>;
  getDividendDistributionsByDividendId(dividendId: number): Promise<DividendDistribution[]>;
  getDividendDistributionsByMemberId(memberId: number): Promise<DividendDistribution[]>;
  createDividendDistribution(distribution: InsertDividendDistribution): Promise<DividendDistribution>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getPendingTasks(): Promise<Task[]>;
  getTasksByType(type: string): Promise<Task[]>;
  getTasksByAssignee(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined>;
  
  // Statistics operations
  getMemberStats(): Promise<{ total: number, active: number, inactive: number, new: number, onLeave: number }>;
  getSavingsStats(): Promise<{ totalSavings: number, monthlySavings: { month: number, year: number, amount: number }[] }>;
  getLoanStats(): Promise<{ totalLoans: number, activeLoans: number, pendingLoans: number, monthlyLoans: { month: number, year: number, amount: number }[] }>;
  
  // Required for auth
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private members: Map<number, Member>;
  private transactions: Map<number, Transaction>;
  private savings: Map<number, Saving>;
  private loans: Map<number, Loan>;
  private dividends: Map<number, Dividend>;
  private dividendDistributions: Map<number, DividendDistribution>;
  private tasks: Map<number, Task>;
  
  private userCurrentId: number;
  private memberCurrentId: number;
  private transactionCurrentId: number;
  private savingCurrentId: number;
  private loanCurrentId: number;
  private dividendCurrentId: number;
  private dividendDistributionCurrentId: number;
  private taskCurrentId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.members = new Map();
    this.transactions = new Map();
    this.savings = new Map();
    this.loans = new Map();
    this.dividends = new Map();
    this.dividendDistributions = new Map();
    this.tasks = new Map();
    
    this.userCurrentId = 1;
    this.memberCurrentId = 1;
    this.transactionCurrentId = 1;
    this.savingCurrentId = 1;
    this.loanCurrentId = 1;
    this.dividendCurrentId = 1;
    this.dividendDistributionCurrentId = 1;
    this.taskCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // This admin user will be properly hashed in the setupAuth function
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Member operations
  async getMember(id: number): Promise<Member | undefined> {
    return this.members.get(id);
  }
  
  async getMemberByUserId(userId: number): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(
      (member) => member.userId === userId,
    );
  }
  
  async getMemberByEmployeeId(employeeId: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(
      (member) => member.employeeId === employeeId,
    );
  }
  
  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }
  
  async getMembersByStatus(status: string): Promise<Member[]> {
    return Array.from(this.members.values()).filter(
      (member) => member.status === status,
    );
  }
  
  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = this.memberCurrentId++;
    const member: Member = { ...insertMember, id };
    this.members.set(id, member);
    
    // Initialize savings account for new member
    this.createSaving({
      memberId: id,
      totalSavings: 0,
      lastUpdate: new Date(),
    });
    
    return member;
  }
  
  async updateMember(id: number, memberData: Partial<Member>): Promise<Member | undefined> {
    const member = await this.getMember(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...memberData };
    this.members.set(id, updatedMember);
    return updatedMember;
  }
  
  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactionsByMemberId(memberId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.memberId === memberId,
    );
  }
  
  async getRecentTransactions(limit: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    
    // Update savings based on transaction type
    if (transaction.type === 'deposit' || transaction.type === 'withdrawal' || 
        transaction.type === 'loan_repayment' || transaction.type === 'dividend_payment') {
      const saving = await this.getSavingByMemberId(transaction.memberId);
      
      if (saving) {
        let newTotal = saving.totalSavings;
        
        if (transaction.type === 'deposit' || transaction.type === 'loan_repayment' || transaction.type === 'dividend_payment') {
          newTotal += transaction.amount;
        } else if (transaction.type === 'withdrawal') {
          newTotal -= transaction.amount;
        }
        
        await this.updateSaving(saving.id, {
          totalSavings: newTotal,
          lastUpdate: new Date(),
        });
      }
    }
    
    // Update loan status if this is a loan repayment
    if (transaction.type === 'loan_repayment') {
      const loans = await this.getLoansByMemberId(transaction.memberId);
      const activeLoans = loans.filter(loan => loan.status === 'active');
      
      if (activeLoans.length > 0) {
        // Sort by application date to pay the oldest loan first
        const oldestLoan = activeLoans.sort((a, b) => 
          new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
        )[0];
        
        const newTotalRepaid = oldestLoan.totalRepaid + transaction.amount;
        const loanUpdate: Partial<Loan> = {
          totalRepaid: newTotalRepaid,
        };
        
        // If loan is fully repaid, update its status
        if (newTotalRepaid >= oldestLoan.amount) {
          loanUpdate.status = 'completed';
        }
        
        await this.updateLoan(oldestLoan.id, loanUpdate);
      }
    }
    
    return transaction;
  }
  
  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = await this.getTransaction(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  // Savings operations
  async getSaving(id: number): Promise<Saving | undefined> {
    return this.savings.get(id);
  }
  
  async getSavingByMemberId(memberId: number): Promise<Saving | undefined> {
    return Array.from(this.savings.values()).find(
      (saving) => saving.memberId === memberId,
    );
  }
  
  async getAllSavings(): Promise<Saving[]> {
    return Array.from(this.savings.values());
  }
  
  async createSaving(insertSaving: InsertSaving): Promise<Saving> {
    const id = this.savingCurrentId++;
    const saving: Saving = { ...insertSaving, id };
    this.savings.set(id, saving);
    return saving;
  }
  
  async updateSaving(id: number, savingData: Partial<Saving>): Promise<Saving | undefined> {
    const saving = await this.getSaving(id);
    if (!saving) return undefined;
    
    const updatedSaving = { ...saving, ...savingData };
    this.savings.set(id, updatedSaving);
    return updatedSaving;
  }
  
  // Loan operations
  async getLoan(id: number): Promise<Loan | undefined> {
    return this.loans.get(id);
  }
  
  async getLoansByMemberId(memberId: number): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(
      (loan) => loan.memberId === memberId,
    );
  }
  
  async getLoansByStatus(status: string): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(
      (loan) => loan.status === status,
    );
  }
  
  async getActiveLoans(): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(
      (loan) => loan.status === 'active' || loan.status === 'approved',
    );
  }
  
  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    const id = this.loanCurrentId++;
    const loan: Loan = { ...insertLoan, id };
    this.loans.set(id, loan);
    
    // Create a task for loan approval if it's pending
    if (loan.status === 'pending') {
      await this.createTask({
        title: "Loan Approval Request",
        description: `New loan application from member #${loan.memberId} for ${loan.amount}`,
        type: "loan_approval",
        status: "pending",
        assignedToUserId: undefined,
        createdAt: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      });
    }
    
    // If loan is approved or active, create a transaction for the disbursement
    if (loan.status === 'approved' || loan.status === 'active') {
      await this.createTransaction({
        memberId: loan.memberId,
        type: 'loan_disbursement',
        amount: loan.amount,
        date: new Date(),
        description: `Loan disbursement for loan #${id}`,
        status: 'completed',
      });
    }
    
    return loan;
  }
  
  async updateLoan(id: number, loanData: Partial<Loan>): Promise<Loan | undefined> {
    const loan = await this.getLoan(id);
    if (!loan) return undefined;
    
    const updatedLoan = { ...loan, ...loanData };
    this.loans.set(id, updatedLoan);
    
    // If status changed to approved, create a disbursement transaction
    if (loan.status === 'pending' && updatedLoan.status === 'approved') {
      await this.createTransaction({
        memberId: loan.memberId,
        type: 'loan_disbursement',
        amount: loan.amount,
        date: new Date(),
        description: `Loan disbursement for loan #${id}`,
        status: 'completed',
      });
    }
    
    return updatedLoan;
  }
  
  // Dividend operations
  async getDividend(id: number): Promise<Dividend | undefined> {
    return this.dividends.get(id);
  }
  
  async getAllDividends(): Promise<Dividend[]> {
    return Array.from(this.dividends.values());
  }
  
  async getLatestDividend(): Promise<Dividend | undefined> {
    const allDividends = Array.from(this.dividends.values());
    if (allDividends.length === 0) return undefined;
    
    return allDividends.sort((a, b) => {
      const dateA = new Date(a.distributionDate);
      const dateB = new Date(b.distributionDate);
      return dateB.getTime() - dateA.getTime();
    })[0];
  }
  
  async createDividend(insertDividend: InsertDividend): Promise<Dividend> {
    const id = this.dividendCurrentId++;
    const dividend: Dividend = { ...insertDividend, id };
    this.dividends.set(id, dividend);
    return dividend;
  }
  
  // Dividend distribution operations
  async getDividendDistribution(id: number): Promise<DividendDistribution | undefined> {
    return this.dividendDistributions.get(id);
  }
  
  async getDividendDistributionsByDividendId(dividendId: number): Promise<DividendDistribution[]> {
    return Array.from(this.dividendDistributions.values()).filter(
      (distribution) => distribution.dividendId === dividendId,
    );
  }
  
  async getDividendDistributionsByMemberId(memberId: number): Promise<DividendDistribution[]> {
    return Array.from(this.dividendDistributions.values()).filter(
      (distribution) => distribution.memberId === memberId,
    );
  }
  
  async createDividendDistribution(insertDistribution: InsertDividendDistribution): Promise<DividendDistribution> {
    const id = this.dividendDistributionCurrentId++;
    const distribution: DividendDistribution = { ...insertDistribution, id };
    this.dividendDistributions.set(id, distribution);
    
    // Create a transaction for the dividend payment
    if (distribution.status === 'completed') {
      await this.createTransaction({
        memberId: distribution.memberId,
        type: 'dividend_payment',
        amount: distribution.amount,
        date: distribution.distributionDate,
        description: `Dividend payment for dividend #${distribution.dividendId}`,
        status: 'completed',
      });
    }
    
    return distribution;
  }
  
  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async getPendingTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.status === 'pending',
    );
  }
  
  async getTasksByType(type: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.type === type,
    );
  }
  
  async getTasksByAssignee(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.assignedToUserId === userId,
    );
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  // Statistics operations
  async getMemberStats(): Promise<{ total: number, active: number, inactive: number, new: number, onLeave: number }> {
    const allMembers = await this.getAllMembers();
    
    return {
      total: allMembers.length,
      active: allMembers.filter(m => m.status === 'active').length,
      inactive: allMembers.filter(m => m.status === 'inactive').length,
      new: allMembers.filter(m => m.status === 'new').length,
      onLeave: allMembers.filter(m => m.status === 'on_leave').length,
    };
  }
  
  async getSavingsStats(): Promise<{ totalSavings: number, monthlySavings: { month: number, year: number, amount: number }[] }> {
    const allSavings = await this.getAllSavings();
    const totalSavings = allSavings.reduce((sum, saving) => sum + saving.totalSavings, 0);
    
    // Get monthly savings transactions for the last 6 months
    const allTransactions = Array.from(this.transactions.values());
    const savingsTransactions = allTransactions.filter(t => t.type === 'deposit');
    
    // Group by month and year
    const monthlySavings: { month: number, year: number, amount: number }[] = [];
    const now = new Date();
    
    for (let i = 0; i < 6; i++) {
      const targetDate = new Date();
      targetDate.setMonth(now.getMonth() - i);
      
      const month = targetDate.getMonth();
      const year = targetDate.getFullYear();
      
      const monthTransactions = savingsTransactions.filter(t => {
        const transDate = new Date(t.date);
        return transDate.getMonth() === month && transDate.getFullYear() === year;
      });
      
      const amount = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      monthlySavings.push({ month, year, amount });
    }
    
    return { totalSavings, monthlySavings };
  }
  
  async getLoanStats(): Promise<{ totalLoans: number, activeLoans: number, pendingLoans: number, monthlyLoans: { month: number, year: number, amount: number }[] }> {
    const allLoans = Array.from(this.loans.values());
    const activeLoans = allLoans.filter(l => l.status === 'active').reduce((sum, loan) => sum + loan.amount, 0);
    const pendingLoans = allLoans.filter(l => l.status === 'pending').length;
    
    // Group by month and year for the last 6 months
    const monthlyLoans: { month: number, year: number, amount: number }[] = [];
    const now = new Date();
    
    for (let i = 0; i < 6; i++) {
      const targetDate = new Date();
      targetDate.setMonth(now.getMonth() - i);
      
      const month = targetDate.getMonth();
      const year = targetDate.getFullYear();
      
      const monthLoans = allLoans.filter(l => {
        const loanDate = new Date(l.applicationDate);
        return loanDate.getMonth() === month && loanDate.getFullYear() === year && 
               (l.status === 'active' || l.status === 'completed');
      });
      
      const amount = monthLoans.reduce((sum, l) => sum + l.amount, 0);
      
      monthlyLoans.push({ month, year, amount });
    }
    
    return { 
      totalLoans: allLoans.length, 
      activeLoans, 
      pendingLoans,
      monthlyLoans
    };
  }
}

export const storage = new MemStorage();
