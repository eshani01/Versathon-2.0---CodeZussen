const savingsRoutes = require("./routes/savingsRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const express = require("express");
const pool = require("./config/db");

const app = express();

app.use(express.json());
app.use("/api/savings", savingsRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        
        res.json({
            message: "FinSight backend is running",
            database_time: result.rows[0].now
        });
    } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
        error: error.message
    });
}
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});