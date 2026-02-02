// testDb.js
const pool = require('./config/db'); 

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()'); 
        console.log('DB connection OK! Time is:', res.rows[0].now);
        process.exit(0);
    } catch (err) {
        console.error('DB connection failed:', err.message);
        process.exit(1);
    }
}

testConnection();
