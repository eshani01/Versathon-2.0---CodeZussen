const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                error: "Google credential is required"
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const googleId = payload.sub;
        const name = payload.name;
        const email = payload.email;
        const profilePicture = payload.picture;

        // Check whether user already exists
        let result = await pool.query(
            `SELECT * FROM users WHERE google_id = $1`,
            [googleId]
        );

        let user;

        if (result.rows.length === 0) {
            // Create new user
            result = await pool.query(
                `INSERT INTO users
                (google_id, name, email, profile_picture)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [googleId, name, email, profilePicture]
            );

            user = result.rows[0];

            // Create default financial preferences
            await pool.query(
                `INSERT INTO financial_preferences
                (user_id)
                VALUES ($1)`,
                [user.id]
            );
        } else {
            user = result.rows[0];
        }

        // Create JWT
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error(error);

        res.status(401).json({
            error: "Google authentication failed"
        });
    }
};

module.exports = {
    googleLogin
};