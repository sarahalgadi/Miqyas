// importing modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// need to import database module here

//import routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dccRouter = require('./routes/dccRouter');

const {isAuth} = require("./middleware/isAuth")
require('dotenv').config();

//express app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//i need to establish connection to the database here; i'm unable to right now

//rendering dcc home only if dcc user is logged in, hence isAuth here is used
app.get('/DCC', isAuth,  (request, response) => {
  response.render('dccHome', { title: 'Home' });
});

//using routes respectively
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/DCC', dccRouter);

//remaining is not my work and idk if needed
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
