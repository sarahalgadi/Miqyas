//const db = require('../database.js');
var express = require('express');
var router = express.Router();

router.get("/assign-role", async function (req, res, next) {
 // Controller function to handle role assignment
const assignRole = (req, res) => {
  // Get the selected role and faculty ID from the request body
  const { username, role } = req.body;

  // Update the faculty's role in the database
  const query = `UPDATE faculty_role SET role = ? WHERE username = ?`;
  db.query(query, [username, role], (err, result) => {
    if (err) {
      // Handle any database errors
      console.error('Error assigning role:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Role assigned successfully
      res.redirect('/roleAssign'); 
    }
  });
};

// Export the controller function
module.exports = { assignRole };
});