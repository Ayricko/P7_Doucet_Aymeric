const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, '$2y$10$y.V7MlX.fKDZuVsUsTnVBeKLpFHssV9AM7SSWSJJYE1Ij0MAgnUxW;');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId != userId) {
      throw 'Invalid user ID';
    } else {
      req.userId = userId;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
};
