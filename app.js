var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = process.env.PORT || 3000;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const e = require('express');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//specifying the port
app.listen(port);

const courses = [
  { code: 'COURSE001', name: 'Course 1', term: "223"},
  { code: 'COURSE002', name: 'Course 2', term:"224"},
  { code: 'COURSE003', name: 'Course 3', term: "222" },
];
//error. we may need to go over the diff types of errors..
app.get('/', (req, res)=>{
  res.render('temp', {courses})
});

app.get('/display-course', (req, res) =>{
  const selectedCourseCode = req.query.courseCode;
  const selectedCourseName = courses.find(course =>
    course.code === selectedCourseCode);
  if (selectedCourseName){
    const courseName = selectedCourseName.name;
    const term = selectedCourseName.term;
    res.render('cc', {courseName, term});
  }
})

app.get('/editActivities', (req, res)=>{
  res.render('editActivities');
})

app.post('/submit_form', (req, res)=>{

  //do we parseInt or math.floor or add a logic overall to prevent decimals? what is the best?
  const formData = {
    project: req.body.project === 'on' ? parseInt(req.body.project_weight) : null,
    major: req.body.major === 'on' ? parseInt(req.body.major_weight) : null,
    assignment: req.body.assignment === 'on' ? parseInt(req.body.assignment_weight) : null,
    quiz: req.body.quiz === 'on' ? parseInt(req.body.quiz_weight) : null,
    final_exam: req.body.final_exam === 'on' ? parseInt(req.body.final_exam_weight) : null,
    other: req.body.other === 'on' ? parseInt(req.body.other_weight) : null,
  };

  console.log(formData); // this is just for debugging. we'll loop over this; if value is not null, we save it in database with type, course code, and semester..

 res.render('temp', { courses });// we need to add logic for after saving this info.. what is displayed later on? and if there's data saved, do we redisplay it..
})

app.get('/generate-report', (req, res)=>{


  res.render('courseReport')
})

app.use((req, res)=>{
  res.status(404).render('404error');
})
module.exports = app;
