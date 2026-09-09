const { validateRating } = require("../../validators");
const pool = require("../config/db");

const listStoresForUser = async (req, res) => {
  const { name, address, sortBy = "name", order = "asc" } = req.query;

  const userId = req.user.id;
  const conditions = [];
  const params = [];

  if (name) {
    conditions.push("s.name LIKE ?");
    params.push(`%${name}%`);
  }
  if (address) {
    conditions.push("s.address LIKE ?");
    params.push(`%${address}%`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";
  const allowedSort = ["name", "address", "overallRating"];
  const sortCol = allowedSort.includes(sortBy) ? sortBy : "name";
  const sortDir = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.address,
              COALESCE(AVG(r.rating), 0) AS overallRating,
              (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) AS userRating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${whereClause}
       GROUP BY s.id
       ORDER BY ${sortCol === "overallRating" ? "overallRating" : `s.${sortCol}`} ${sortDir}`,
      [userId, ...params],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores." });
  }
};

const submitOrUpdateRating = async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  console.log("Received rating submission:", { userId, storeId, rating });

  const error = validateRating(rating);
  if (error) {
    res.status(400).json({ message: error });
    return;
  }

  try {
    const [store] = await pool.query("SELECT id FROM stores WHERE id = ?", [
      storeId,
    ]);
    if (!store) {
      res.status(404).json({ message: "Store not found." });
      return;
    }

    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [userId, storeId, rating],
    );
    res.json({ message: "Rating submitted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting rating." });
  }
};

module.exports = {
  listStoresForUser,
  submitOrUpdateRating,
};
