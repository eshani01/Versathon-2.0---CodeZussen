const express = require("express");
const cors = require("cors");


// 1. Import all routes (including your new AI routes!)
const savingsRoutes = require("./routes/savingsRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const aiRoutes = require("./routes/aiRoutes"); // <-- Your AI brain!

// 2. Initialize App
const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Connect Routes
app.use("/api/savings", savingsRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes); // <-- Connecting your AI routes to the server!

const { OAuth2Client } = require('google-auth-library');
const pool = require('./config/db'); // Your database connection
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// The Google Login Endpoint
app.post('/api/auth/google', async (req, res) => {
    try {
        const { token } = req.body;
        // 1. Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email } = ticket.getPayload();

        // 2. Check if user already exists in your Neon Database
        let dbResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = dbResult.rows[0];

        // 3. If they are new, save them!
        if (!user) {
            dbResult = await pool.query(
                'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', 
                [name, email]
            );
            user = dbResult.rows[0];
        }

        // 4. Send the user data back to the frontend
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ success: false, message: "Authentication failed" });
    }
});

// 5. Database Health Check Route
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "FinSight backend is running",
            database_time: result.rows[0].now
        });
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

// 6. Start Server
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});