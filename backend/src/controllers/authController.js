const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
} = require("../../validators");

const signup = async (req, res) => {
  const { name, email, address, password } = req.body;
  const errors = [
    validateName(name),
    validateEmail(email),
    validateAddress(address),
    validatePassword(password),
  ].filter((e) => e);

  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length) {
      res.status(409).json({ message: "Email already registered." });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, address, "user"],
    );
    const insertId = result.insertId;

    res.status(201).json({ id: insertId, name, email, role: "user" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!users.length) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    // Set HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allows cross-origin cookies
      maxAge: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    });

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during login." });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    res.status(400).json({ message: passwordError });
    return;
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    const users = rows;
    if (!users.length) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const match = await bcrypt.compare(currentPassword, users[0].password);
    if (!match) {
      res.status(401).json({ message: "Current password is incorrect." });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashed,
      req.user.id,
    ]);
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating password." });
  }
};

const checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ authenticated: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach { id, role, email } to the request object
    return res.json({ authenticated: true, user: decoded });
  } catch (err) {
    return res
      .status(401)
      .json({ authenticated: false, message: "Invalid or expired token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  signup,
  login,
  updatePassword,
  checkAuth,
  logout,
};
