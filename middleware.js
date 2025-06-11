const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).send({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, 'yourSecretKey');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
