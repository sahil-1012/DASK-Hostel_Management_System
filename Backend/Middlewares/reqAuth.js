const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token is required", success: false });
  }

  const token = authorization.split(" ")[1];
  
  try {
    const data = jwt.verify(token, process.env.SECRET);
    req.id = data._id;
    next();
    
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized: " + error.message, success: false });
  }
};

module.exports = requireAuth;
