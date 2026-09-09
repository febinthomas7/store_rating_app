const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; // Extracted directly from HttpOnly cookie

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { id: user.id, role: user.role, email: user.email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { authenticateUser };
