const { Pool } = require('pg');
require('dotenv').config(); // Forces Node to read your .env file

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // This line is MANDATORY for Neon/Cloud databases!
    }
});
// Prevents the server from crashing when Neon drops an idle connection
pool.on('error', (err) => {
    console.error('Neon DB Connection dropped (safe to ignore):', err.message);
});

pool.connect()
    .then(() => console.log('✅ Connected to Neon Cloud Database!'))
    .catch(err => console.error('❌ Database connection error:', err.stack));

module.exports = pool;