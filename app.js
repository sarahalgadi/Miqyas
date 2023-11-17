var express = require('express');
var cookieParser = require('cookie-parser');

//db 
const db = require('database');
//express app
var app = express();

// view engine setup

app.set('view engine', 'ejs');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.db = db; // Make the database accessible in the request object
  next();
});

var chairRouter = require('./routes/chairRouter');
const { database } = require('./database');


app.get('/roleAssign',  (request, response) => {
  response.render('roleAssign', { title: 'Roles' });
});


app.use('/roleAssign', chairRouter);


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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});