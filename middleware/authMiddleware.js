const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

async function authenticateToken(req, res, next) {
  // Check if the access token is stored in the session
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.sendStatus(401);
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Check if the user still exists in the database
    const dbUser = await UserModel.getUserByUsername(user.username);

    if (!dbUser) {
      return res.sendStatus(403);
    }

    req.user = dbUser;
    next(); 
  });
}

module.exports = authenticateToken;
