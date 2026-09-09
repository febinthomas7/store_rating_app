require("dotenv").config();
const mysql = require("mysql2/promise");

async function initDb() {
  let connection;

  try {
    console.log("⏳ Connecting to MySQL server...");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT) || 11418,
      ssl: process.env.DB_HOST && process.env.DB_HOST !== "localhost" 
        ? { rejectUnauthorized: false } 
        : false,
    });

    const dbName = process.env.DB_NAME || "defaultdb";

    // 1. Create Database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`✅ Using database: ${dbName}`);

    // 2. Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role ENUM('ADMIN', 'USER', 'STORE_OWNER') NOT NULL DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Table 'users' created or already exists.");

    // 3. Create Stores Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        address VARCHAR(400) NOT NULL,
        owner_id INT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);
    console.log("✅ Table 'stores' created or already exists.");

    // 4. Create Ratings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        UNIQUE KEY user_store_unique (user_id, store_id)
      );
    `);
    console.log("✅ Table 'ratings' created or already exists.");

    console.log("🎉 Database initialization completed successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

initDb();