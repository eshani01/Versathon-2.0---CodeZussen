const {
    getTransactions,
    createTransaction
} = require("../db/queries");

// GET /api/transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await getTransactions(req.user.id);

        res.json(transactions);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch transactions"
        });
    }
};

// POST /api/transactions
const addTransaction = async (req, res) => {
    try {
        const {
            categoryId,
            amount,
            transactionType,
            description,
            transactionDate,
            sourceType,
            rawInput
        } = req.body;

        const transaction = await createTransaction(
            req.user.id,
            categoryId,
            amount,
            transactionType,
            description,
            transactionDate,
            sourceType,
            rawInput
        );

        res.status(201).json(transaction);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create transaction"
        });
    }
};

module.exports = {
    getAllTransactions,
    addTransaction
};