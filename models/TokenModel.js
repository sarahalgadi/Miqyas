const pool = require('../database');


class TokenModel {
  static async storeRefreshToken(username, refreshToken) {
    const query = 'INSERT INTO refresh_tokens (username, token) VALUES (?, ?)';
    const values = [username, refreshToken];
    await pool.query(query, values);
  }

  static async deleteRefreshToken(username, refreshToken) {
    const query = 'DELETE FROM refresh_tokens WHERE username = ? AND token = ?';
    const values = [username, refreshToken];
    await pool.query(query, values);
  }
}


module.exports = TokenModel;
