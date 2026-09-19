const express = require("express");

const {
    getSavingsGoals,
    createSavingsGoal,
    contributeToSavings
} = require("../controllers/savingsController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get savings goals
router.get("/", authMiddleware, getSavingsGoals);

// Create savings goal
router.post("/", authMiddleware, createSavingsGoal);

// Contribute to a savings goal
router.patch("/:id/contribute", authMiddleware, contributeToSavings);

module.exports = router;