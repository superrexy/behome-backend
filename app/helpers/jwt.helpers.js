const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: (user) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return token;
  },
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      return false;
    }
  },
};
