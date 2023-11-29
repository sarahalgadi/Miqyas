// controllers/AuthController.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const TokenModel = require('../models/TokenModel');


async function login(req, res) {
    console.log("inside login function:");
    const username = req.body.username;
    const password = req.body.password;
  
    const user = await UserModel.getUserByUsername(username);
    console.log(user);
  
    if (!user) {
      return res.send('<script>alert("User not found."); window.location.href = "/";</script>');
    }
  
    if (user.password !== password) {
      return res.send('<script>alert("Incorrect password."); window.location.href = "/";</script>');
    }
  
    const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '100m' });
    const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET);
  
    // Store refresh token in the database
    await TokenModel.storeRefreshToken(user.username, refreshToken);
  
    req.session.user = user;
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
  
    res.redirect('/home');
  }
  

async function logout(req, res) {
    const { token } = req.body;
    // Delete refresh token from the database
    await TokenModel.deleteRefreshToken(req.user.username, token);

    res.sendStatus(204);
  }

async function token(req, res) {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403);

      // Check if the refresh token exists in the database
      const storedToken = await TokenModel.getRefreshToken(user.username, token);
      if (!storedToken) return res.sendStatus(403);

      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
      res.json({ accessToken });
    });
  }


module.exports = {login, logout, token};
