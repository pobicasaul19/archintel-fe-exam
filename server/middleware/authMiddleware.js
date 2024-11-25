const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, (err, authData) => {
      if (err) {
        res.status(403).json({ message: "Forbidden access." });
      }
      req.authData = authData;
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthenticated." });
  }
};

module.exports = { verifyToken };