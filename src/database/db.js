// src/database/db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

let pool;

function getDatabasePool() {
  if (pool && pool.totalCount > 0) {
    // If a pool exists and has active clients, return the existing pool
    return pool;
  } else {
    // Otherwise, create a new pool
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    return pool;
  }
}

module.exports = getDatabasePool;
