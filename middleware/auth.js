const jwt = require("jsonwebtoken");
const Token = require("../model/token");

const verifyToken = async (req, res, next) => {
  // get the token from the request
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // check if the token if present
  if (!token) {
    return res
      .status(403)
      .json({ error: "Token is not present for authorization" });
  }

  // verify the token with the key
  try {
    const userToken = await Token.findOne({ token });
    const decodedPayload = jwt.verify(userToken.token, process.env.TOKEN_KEY);
    req.user = decodedPayload;
  } catch {
    return res
      .status(401)
      .json({ error: "Invalid session token !! Please login again" });
  }
  return next();
};

module.exports = verifyToken;
