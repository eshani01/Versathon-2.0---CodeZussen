const pool = require("../config/db");

// GET /api/savings
const getSavingsGoals = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM savings_goals
             WHERE user_id = $1
             ORDER BY target_date ASC NULLS LAST`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch savings goals"
        });
    }
};


// POST /api/savings
const createSavingsGoal = async (req, res) => {
    try {
        const {
            goalName,
            targetAmount,
            currentAmount,
            targetDate
        } = req.body;

        const result = await pool.query(
            `INSERT INTO savings_goals
            (user_id, goal_name, target_amount, current_amount, target_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                req.user.id,
                goalName,
                targetAmount,
                currentAmount || 0,
                targetDate
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create savings goal"
        });
    }
};


// PATCH /api/savings/:id/contribute
const contributeToSavings = async (req, res) => {
    try {
        const { amount } = req.body;
        const { id } = req.params;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                error: "Contribution amount must be greater than 0"
            });
        }

        const result = await pool.query(
            `UPDATE savings_goals
             SET current_amount = current_amount + $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             AND user_id = $3
             RETURNING *`,
            [amount, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Savings goal not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to contribute to savings goal"
        });
    }
};


module.exports = {
    getSavingsGoals,
    createSavingsGoal,
    contributeToSavings
};
