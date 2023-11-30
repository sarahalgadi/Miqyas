// i only kept things i'm using; it was cluttering my brain :)
var path = require('path');
var express = require('express');
const bodyParser = require('body-parser');
const pool = require('./database')

//importing routers
const ciRouter = require('./routes/ciRouter');

//contains port information
require('dotenv').config();

//express app
const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handling and rendering dcc and ci routes
app.use('/assessments', ciRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;