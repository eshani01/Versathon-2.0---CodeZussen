const express = require("express");

const {
    getAllTransactions,
    addTransaction
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all transactions
router.get("/", authMiddleware, getAllTransactions);

// Add a transaction
router.post("/", authMiddleware, addTransaction);

module.exports = router;