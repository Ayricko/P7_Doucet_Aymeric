// Imports
const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = '$2y$10$y.V7MlX.fKDZuVsUsTnVBeKLpFHssV9AM7SSWSJJYE1Ij0MAgnUxW;';

// Exported functions
module.exports = {
  getUserId: (authorization) => {
    let userId = -1;
    let token = authorization;
    if (token != null) {
      try {
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (jwtToken != null) userId = jwtToken.userId;
      } catch (err) {}
    }
    return userId;
  },
};
