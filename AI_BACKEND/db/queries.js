const pool = require("../config/db");

// Get all transactions for a user
const getTransactions = async (userId) => {
    const result = await pool.query(
        `SELECT * 
         FROM transactions 
         WHERE user_id = $1 
         ORDER BY transaction_date DESC`,
        [userId]
    );

    return result.rows;
};

// Add a transaction
const createTransaction = async (
    userId,
    categoryId,
    amount,
    transactionType,
    description,
    transactionDate,
    sourceType,
    rawInput
) => {
    const result = await pool.query(
        `INSERT INTO transactions
        (user_id, category_id, amount, transaction_type, description,
         transaction_date, source_type, raw_input)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
            userId,
            categoryId,
            amount,
            transactionType,
            description,
            transactionDate,
            sourceType,
            rawInput
        ]
    );

    return result.rows[0];
};

const getCategories = async () => {
    const result = await pool.query(
        `SELECT * FROM categories
         ORDER BY name`
    );

    return result.rows;
};
module.exports = {
    getTransactions,
    createTransaction,
    getCategories
};