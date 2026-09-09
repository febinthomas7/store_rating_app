const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
} = require("../../validators");

const USER_SORT_COLUMNS = ["name", "email", "address", "role"];
const STORE_SORT_COLUMNS = ["name", "email", "address", "rating"];

const getDashboard = async (_req, res) => {
  try {
    const [[{ userCount }]] = await pool.query(
      "SELECT COUNT(*) AS userCount FROM users",
    );
    const [[{ storeCount }]] = await pool.query(
      "SELECT COUNT(*) AS storeCount FROM stores",
    );
    const [[{ ratingCount }]] = await pool.query(
      "SELECT COUNT(*) AS ratingCount FROM ratings",
    );
    res.json({
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard stats." });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  console.log("Received data for new user:", { name, email, address, role });

  const errors = [
    validateName(name),
    validateEmail(email),
    validateAddress(address),
    validatePassword(password),
  ].filter((e) => e);

  if (!role || !["ADMIN", "USER", "STORE_OWNER"].includes(role)) {
    errors.push("Role must be admin, user, or store_owner.");
  }
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
      res.status(409).json({ message: "Email already exists." });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, address, role],
    );
    res.status(201).json({ id: result.insertId, name, email, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user." });
  }
};

const createStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  const errors = [validateName(name), validateAddress(address)].filter(
    (e) => e,
  );
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id || null],
    );
    res.status(201).json({ id: result.insertId, name, email, address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating store." });
  }
};

const listUsers = async (req, res) => {
  const {
    name,
    email,
    address,
    role,
    sortBy = "name",
    order = "asc",
  } = req.query;
  const conditions = [];
  const params = [];

  if (name) {
    conditions.push("name LIKE ?");
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push("email LIKE ?");
    params.push(`%${email}%`);
  }
  if (address) {
    conditions.push("address LIKE ?");
    params.push(`%${address}%`);
  }
  if (role) {
    conditions.push("role = ?");
    params.push(role);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";
  const sortCol = USER_SORT_COLUMNS.includes(sortBy) ? sortBy : "name";
  const sortDir = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, address, role FROM users ${whereClause} ORDER BY ${sortCol} ${sortDir}`,
      params,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users." });
  }
};

const listStores = async (req, res) => {
  const { name, email, address, sortBy = "name", order = "asc" } = req.query;
  const conditions = [];
  const params = [];

  if (name) {
    conditions.push("s.name LIKE ?");
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push("s.email LIKE ?");
    params.push(`%${email}%`);
  }
  if (address) {
    conditions.push("s.address LIKE ?");
    params.push(`%${address}%`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";
  const sortCol = STORE_SORT_COLUMNS.includes(sortBy) ? sortBy : "name";
  const sortDir = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              COALESCE(AVG(r.rating), 0) AS rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${whereClause}
       GROUP BY s.id
       ORDER BY ${sortCol === "rating" ? "rating" : `s.${sortCol}`} ${sortDir}`,
      params,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores." });
  }
};

const getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, address, role FROM users WHERE id = ?",
      [id],
    );
    if (!rows.length) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const user = rows[0];
    if (user.role === "store_owner") {
      const [[store]] = await pool.query(
        `SELECT s.id, COALESCE(AVG(r.rating), 0) AS rating
         FROM stores s LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = ? GROUP BY s.id`,
        [id],
      );
      user.rating = store ? store.rating : null;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user details." });
  }
};

module.exports = {
  getDashboard,
  createUser,
  createStore,
  listUsers,
  listStores,
  getUserDetails,
};
