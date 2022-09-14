const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // get the token from the request
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  // check if the token if present
  if(!token) {
    return res.status(403).send("Token is not present for authorization");
  }

  // verify the token with the key
  try{
    const decodedPayload = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decodedPayload
  }
  catch{
    return res.status(401).send("Invalid session token !! Please login again");
  }
  return next();
}

module.exports = verifyToken;
