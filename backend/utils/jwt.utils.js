// Imports
const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '$2y$10$y.V7MlX.fKDZuVsUsTnVBeKLpFHssV9AM7SSWSJJYE1Ij0MAgnUxW;';

// Exported functions
module.exports = {
  generateTokenForUser: (userData) =>
    jwt.sign(
      {
        userId: userData.id,
        isAdmin: userData.isAdmin,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: '1h',
      }
    ),
  parseAuthorization: (authorization) => (authorization != null ? authorization.replace('Bearer ', '') : null),
  getUserId: (authorization) => {
    let userId = -1;
    let token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (jwtToken != null) userId = jwtToken.userId;
      } catch (err) {}
    }
    return userId;
  },
};
