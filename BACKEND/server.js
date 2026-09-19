require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Load your AI routes
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5001;

// Start the server and KEEP it alive
const server = app.listen(PORT, () => {
    console.log(`✅ Server successfully started on http://localhost:${PORT}`);
    console.log(`🎧 Listening for requests... (Press Ctrl+C to stop)`);
});

// If something tries to crash the server, this will catch it and print the error!
server.on('error', (error) => {
    console.error("❌ CRITICAL SERVER ERROR:");
    console.error(error);
});

process.on('uncaughtException', (err) => {
    console.error("❌ UNCAUGHT EXCEPTION SHUTTING DOWN SERVER:");
    console.error(err);
});