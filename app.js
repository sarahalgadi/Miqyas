require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//routes in our website
const courseReportRoutes = require('./routes/courseReportRoutes');
const coordinatorRoutes = require('./routes/coordinatorRoutes');
const sectionReportRoutes = require('./routes/sectionReportRoutes');
const courseInstructorRoutes = require('./routes/courseInstructorRoutes');
const dccRoutes = require('./routes/dccRoutes');
const chairRoutes = require('./routes/chairRoutes');
const homeRoutes = require('./routes/homeRoutes'); 
//authentication reqs.
const jwt = require('jsonwebtoken');
const session = require('express-session');
const authMiddleware = require('./middleware/authMiddleware');
const AuthController = require('./controllers/authController');

//specifying the port
app.listen(port);




app.get('/', async(req, res)=>{
  res.render('login', {title: 'Login'})
})

//session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.post('/auth/login', AuthController.login);
app.use(authMiddleware);
  app.post('/auth/token', AuthController.token);
  app.delete('/auth/logout', AuthController.logout);


  
// our routes.
app.use('/', homeRoutes);
app.use('/', courseInstructorRoutes);
app.use('/', courseReportRoutes);
app.use('/', coordinatorRoutes);
app.use('/', sectionReportRoutes);
app.use('/', dccRoutes);
app.use('/', chairRoutes);



app.use((req, res)=>{
  res.status(404).render('error', {message: "404: Page not found"});
})

module.exports = app;
