const jwt = require("jsonwebtoken");

const secretKey = "your_secret_key";
const { successResponse, failResponse } = require("./response");

module.exports.generateToken = (data) => {
  const token = jwt.sign(data, secretKey, { expiresIn: "24h" });
  return token;
};

module.exports.validateToken = (token) => {
  try {
    const decodedData = jwt.verify(token, secretKey);
    return decodedData;
  } catch (error) {
    throw new Error("Invalid token")
  }
};

module.exports.getTokenFromHeader = (req) => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
};

module.exports.validateHeader = () => async (req, res, next) => {
  try {
    const jwt = this.getTokenFromHeader(req);
    console.log("jwt",jwt);
    res.locals.user = this.validateToken(jwt);

    next();
  } catch (error) {
    return failResponse("Login session expired", res);
  }
};
