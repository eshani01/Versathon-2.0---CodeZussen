const pool = require("../config/db");

// GET /api/budgets
const getBudgets = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                b.id,
                b.amount AS budget_amount,
                b.period,
                b.start_date,
                b.end_date,
                c.name AS category,
                COALESCE(SUM(t.amount), 0) AS actual_spend
             FROM budgets b
             LEFT JOIN categories c
                ON b.category_id = c.id
             LEFT JOIN transactions t
                ON t.category_id = b.category_id
                AND t.user_id = b.user_id
                AND t.transaction_type = 'expense'
                AND t.transaction_date >= b.start_date
                AND (b.end_date IS NULL OR t.transaction_date <= b.end_date)
             WHERE b.user_id = $1
             GROUP BY
                b.id,
                b.amount,
                b.period,
                b.start_date,
                b.end_date,
                c.name
             ORDER BY b.start_date DESC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch budgets"
        });
    }
};


// POST /api/budgets
const createBudget = async (req, res) => {
    try {
        const {
            categoryId,
            amount,
            period,
            startDate,
            endDate
        } = req.body;

        const result = await pool.query(
            `INSERT INTO budgets
            (user_id, category_id, amount, period, start_date, end_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                req.user.id,
                categoryId,
                amount,
                period,
                startDate,
                endDate
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create budget"
        });
    }
};


module.exports = {
    getBudgets,
    createBudget
};