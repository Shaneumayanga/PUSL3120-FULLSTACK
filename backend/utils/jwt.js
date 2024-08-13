const jwt = require("jsonwebtoken");

const secretKey = "your_secret_key";

module.exports.generateToken = (data) => {
  const token = jwt.sign(data, secretKey, { expiresIn: "24h" });
  return token;
};

module.exports.validateToken = (token) => {
  try {
    const decodedData = jwt.verify(token, secretKey);
    return decodedData;
  } catch (error) {
    return { error: "Invalid token" };
  }
};
