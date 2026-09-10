const pool = require("../config/db");

const getStoreDashboard = async (req, res) => {
  const ownerId = req.user.id;

  try {
    const [[store]] = await pool.query(
      "SELECT id, name FROM stores WHERE owner_id = ?",
      [ownerId],
    );

    if (!store) {
      res
        .status(404)
        .json({ message: "No store associated with this account." });
      return;
    }

    const [ratings] = await pool.query(
      `SELECT u.id AS userId, u.name, u.email, r.rating, r.created_at
       FROM ratings r JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [store.id],
    );

    const [[{ avgRating }]] = await pool.query(
      "SELECT COALESCE(AVG(rating), 0) AS avgRating FROM ratings WHERE store_id = ?",
      [store.id],
    );

    res.json({ store: store.name, averageRating: avgRating, ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching store dashboard." });
  }
};

module.exports = {
  getStoreDashboard,
};
