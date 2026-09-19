const express = require("express");

const {
    getBudgets,
    createBudget
} = require("../controllers/budgetController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get budgets
router.get("/", authMiddleware, getBudgets);

// Create budget
router.post("/", authMiddleware, createBudget);

module.exports = router;