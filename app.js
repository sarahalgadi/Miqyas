require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = process.env.PORT || 3000;
const app = express();
const pool = require('./database');
const bodyParser = require('body-parser');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const courseReportRoutes = require('./routes/courseReportRoutes');
const cc = require('./routes/cc');
const sectionReportRoutes = require('./routes/sectionReport');
const courseInstructorRoutes = require('./routes/courseInstructor');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const authMiddleware = require('./middleware/authMiddleware');

const AuthController = require('./controllers/authController');
const homeRoutes = require('./routes/homeRoutes'); 
//specifying the port
app.listen(port);

const courses = [
  { code: 'COURSE001', name: 'Course 1', term: "223"},
  { code: 'COURSE002', name: 'Course 2', term:"224"},
  { code: 'SE322', name: 'Course 3', term: "223" },
];
//error. we may need to go over the diff types of errors..
//this is just temp...temp is the page displaying coordinator courses. reemas part.
//app.get('/',  async (req, res)=>{
  //const name = "SE322";
  //res.render('temp', {courses, name})
//});

//Ayat i changed this in app-------------------------------------------
app.get('/', async(req, res)=>{
  res.render('login', {title: 'Login'})
})

app.use(session({
  secret: process.env.SESSION_SECRET, // Change this to a secure secret key
  resave: false,
  saveUninitialized: true,
}));
app.post('/auth/login', AuthController.login);
app.use(authMiddleware);
  app.post('/auth/token', AuthController.token);
  app.delete('/auth/logout', AuthController.logout);


  

app.use('/', homeRoutes);
//todo: for controllers: error handling + agree on where res should go after any info is saved!
app.use('/', courseInstructorRoutes);
app.use('/', courseReportRoutes);//editing courseReport routes.. for coordinator.
app.use('/', cc); //this is just for cc.ejs aka the page where there are tabs for a chosen coordinated course
app.use('/', sectionReportRoutes);




app.use((req, res)=>{
  res.status(404).render('404error');
})

module.exports = app;
