const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  // accessing database
//


  //need a query here to display the courses into cards
  //also need a query for saving clos

  //QUERY NOT UPDATED
 /* database.query('SELECT * FROM course_supervised', (err, results) => {
    if (err) {
      console.error(err);
      response.status(500).send('Error retrieving courses.');
      return;
    }
    // Retrieved courses will be passed to the view to display in cards
    response.render('dccHome', { title: 'Home', courses: results });
  });*/
});

module.exports = router;
