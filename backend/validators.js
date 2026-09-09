const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const validateName = (name) => {
  if (!name || name.length < 4 || name.length > 20) {
    return "Name must be between 4 and 20 characters.";
  }
  return null;
};

const validateAddress = (address) => {
  if (address && address.length > 400) {
    return "Address must be at most 400 characters.";
  }
  return null;
};

const validateEmail = (email) => {
  if (!email || !EMAIL_RE.test(email)) {
    return "Invalid email format.";
  }
  return null;
};

const validatePassword = (password) => {
  if (!password || !PASSWORD_RE.test(password)) {
    return "Password must be 8-16 characters, include at least one uppercase letter and one special character.";
  }
  return null;
};

const validateRating = (rating) => {
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return "Rating must be an integer between 1 and 5.";
  }
  return null;
};

module.exports = {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
  validateRating,
};
