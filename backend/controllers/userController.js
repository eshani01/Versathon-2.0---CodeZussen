const pool = require("../config/db");

// GET /api/user/profile
const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                u.id,
                u.name,
                u.email,
                u.profile_picture,
                fp.monthly_income,
                fp.preferred_currency,
                fp.monthly_savings_target
             FROM users u
             LEFT JOIN financial_preferences fp
             ON u.id = fp.user_id
             WHERE u.id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch profile"
        });
    }
};


// PUT /api/user/preferences
const updatePreferences = async (req, res) => {
    try {
        const {
            monthlyIncome,
            preferredCurrency,
            monthlySavingsTarget
        } = req.body;

        const result = await pool.query(
            `UPDATE financial_preferences
             SET monthly_income = $1,
                 preferred_currency = $2,
                 monthly_savings_target = $3,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $4
             RETURNING *`,
            [
                monthlyIncome,
                preferredCurrency,
                monthlySavingsTarget,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Financial preferences not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update preferences"
        });
    }
};


module.exports = {
    getProfile,
    updatePreferences
};