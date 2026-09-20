const { Pool } = require('pg');
require('dotenv').config(); // Forces Node to read your .env file

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // This line is MANDATORY for Neon/Cloud databases!
    }
});

pool.connect()
    .then(() => console.log('✅ Connected to Neon Cloud Database!'))
    .catch(err => console.error('❌ Database connection error:', err.stack));

module.exports = pool;