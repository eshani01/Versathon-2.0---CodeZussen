const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

// 1. Import all routes (including your new AI routes!)
const savingsRoutes = require("./routes/savingsRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const aiRoutes = require("./routes/aiRoutes"); // <-- Your AI brain!

// 2. Initialize App
const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Connect Routes
app.use("/api/savings", savingsRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes); // <-- Connecting your AI routes to the server!

// 5. Database Health Check Route
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "FinSight backend is running",
            database_time: result.rows[0].now
        });
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

// 6. Start Server
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});