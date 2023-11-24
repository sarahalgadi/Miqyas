var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = process.env.PORT || 3000;
const app = express();
const pool = require('./database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const courseReportRoutes = require('./routes/courseReportRoutes');
const cc = require('./routes/cc');
const ccModel = require('./models/cc');
const sectionReportRoutes = require('./routes/sectionReport');


//specifying the port
app.listen(port);

const courses = [
  { code: 'COURSE001', name: 'Course 1', term: "223"},
  { code: 'COURSE002', name: 'Course 2', term:"224"},
  { code: 'SE322', name: 'Course 3', term: "223" },
];
//error. we may need to go over the diff types of errors..
//this is just temp...temp is the page displaying coordinator courses. reemas part.
app.get('/',  async (req, res)=>{
  const name = "SE322";
 res.render('temp', {courses, name})
});

//todo: for controllers: error handling + agree on where res should go after any info is saved!

app.use('/', courseReportRoutes);//editing courseReport routes.. for coordinator.
app.use('/', cc); //this is just for cc.ejs aka the page where there are tabs for a chosen coordinated course
app.use('/', sectionReportRoutes);
app.post('/save-section-report', (req, res)=>{
  console.log(req.body.allActionPlanData);
  console.log(req.body.calculatedResults);
})

app.use((req, res)=>{
  res.status(404).render('404error');
})

module.exports = app;
