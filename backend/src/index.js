import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectDB } from "./db/db.js";

// Routes
import { router as userRouter } from "./routes/userRoutes.js";
import { router as companyRouter } from "./routes/companyRoutes.js";
import { router as leadRouter } from "./routes/leadRoutes.js";
import { router as publicLeadRouter } from "./routes/publicLeadRoutes.js";
import { router as superAdminRoutes } from "./routes/superadmin.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 🔐 Admin / Dashboard routes (AUTH REQUIRED inside routes)
app.use("/api/v1/user", userRouter);
app.use("/api/v1/lead", leadRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/superadmin", superAdminRoutes);

// 🌍 Public routes (NO AUTH – client websites)
app.use("/api/v1", publicLeadRouter);

// Health check
app.get("/", (req, res) => {
  res.send("server on 🚀");
});

// Start server
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`✅ Server running on port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

start();
