const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 11418,
  ssl: {
    rejectUnauthorized: false, // Mandatory for Aiven cloud connections
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL database");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection error:", error.message);
  }
})();

module.exports = pool;
