//one version of the code for Render.com deployment

// require('dotenv').config();
// const { Pool } = require('pg');

// // Use DATABASE_URL if it exists (Render), otherwise build from components (local)
// const connectionString = process.env.DATABASE_URL || 
//   `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
//   `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// const pool = new Pool({
//   connectionString,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// module.exports = pool;


//another version of the code for local development
require('dotenv').config();
const { Pool } = require('pg');

const isRender = !!process.env.DATABASE_URL;

const pool = new Pool(
  isRender
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: false, 
      }
);

module.exports = pool;
