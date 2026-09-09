require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("./src/config/db");

async function seedAdmin() {
  const adminName = process.env.ADMIN_NAME || "System Administrator";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123!";
  const adminAddress = process.env.ADMIN_ADDRESS || "Admin HQ, New Delhi";

  try {
    console.log("⏳ Checking for existing Admin account...");

    // Check if admin already exists
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [adminEmail],
    );

    if (existingUsers.length > 0) {
      console.log(`⚠️ Admin user with email '${adminEmail}' already exists.`);
      process.exit(0);
    }

    // Hash the admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Insert Admin user into database
    const query = `
      INSERT INTO users (name, email, password, address, role)
      VALUES (?, ?, ?, ?, 'ADMIN')
    `;

    await pool.query(query, [
      adminName,
      adminEmail,
      hashedPassword,
      adminAddress,
    ]);

    console.log("✅ Admin account created successfully!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Error seeding Admin account:", error.message);
  } finally {
    await pool.end();
    process.exit();
  }
}

seedAdmin();
