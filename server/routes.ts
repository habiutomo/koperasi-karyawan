import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertMemberSchema, 
  insertTransactionSchema, 
  insertLoanSchema, 
  insertTaskSchema, 
  insertDividendSchema,
  insertDividendDistributionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  await setupAuth(app);

  // Member routes
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/members/stats", async (req, res) => {
    try {
      const stats = await storage.getMemberStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.getMember(parseInt(req.params.id));
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/members", async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(validatedData);
      res.status(201).json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.patch("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.updateMember(id, req.body);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const transactions = await storage.getRecentTransactions(limit);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/transactions/member/:memberId", async (req, res) => {
    try {
      const memberId = parseInt(req.params.memberId);
      const transactions = await storage.getTransactionsByMemberId(memberId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Savings routes
  app.get("/api/savings", async (req, res) => {
    try {
      const savings = await storage.getAllSavings();
      res.json(savings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/savings/stats", async (req, res) => {
    try {
      const stats = await storage.getSavingsStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/savings/member/:memberId", async (req, res) => {
    try {
      const memberId = parseInt(req.params.memberId);
      const saving = await storage.getSavingByMemberId(memberId);
      if (!saving) {
        return res.status(404).json({ error: "Savings not found for this member" });
      }
      res.json(saving);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Loan routes
  app.get("/api/loans", async (req, res) => {
    try {
      const status = req.query.status as string;
      let loans;
      
      if (status) {
        loans = await storage.getLoansByStatus(status);
      } else {
        loans = await storage.getActiveLoans();
      }
      
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/loans/stats", async (req, res) => {
    try {
      const stats = await storage.getLoanStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/loans/member/:memberId", async (req, res) => {
    try {
      const memberId = parseInt(req.params.memberId);
      const loans = await storage.getLoansByMemberId(memberId);
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/loans", async (req, res) => {
    try {
      const validatedData = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(validatedData);
      res.status(201).json(loan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.patch("/api/loans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const loan = await storage.updateLoan(id, req.body);
      if (!loan) {
        return res.status(404).json({ error: "Loan not found" });
      }
      res.json(loan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Dividend routes
  app.get("/api/dividends", async (req, res) => {
    try {
      const dividends = await storage.getAllDividends();
      res.json(dividends);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/dividends/latest", async (req, res) => {
    try {
      const dividend = await storage.getLatestDividend();
      if (!dividend) {
        return res.status(404).json({ error: "No dividend found" });
      }
      res.json(dividend);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/dividends", async (req, res) => {
    try {
      const validatedData = insertDividendSchema.parse(req.body);
      const dividend = await storage.createDividend(validatedData);
      res.status(201).json(dividend);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.get("/api/dividends/:id/distributions", async (req, res) => {
    try {
      const dividendId = parseInt(req.params.id);
      const distributions = await storage.getDividendDistributionsByDividendId(dividendId);
      res.json(distributions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/dividend-distributions", async (req, res) => {
    try {
      const validatedData = insertDividendDistributionSchema.parse(req.body);
      const distribution = await storage.createDividendDistribution(validatedData);
      res.status(201).json(distribution);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Task routes
  app.get("/api/tasks/pending", async (req, res) => {
    try {
      const tasks = await storage.getPendingTasks();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/tasks/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const tasks = await storage.getTasksByType(type);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.updateTask(id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
