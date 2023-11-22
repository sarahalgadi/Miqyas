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



//specifying the port
app.listen(port);

const courses = [
  { code: 'COURSE001', name: 'Course 1', term: "223"},
  { code: 'COURSE002', name: 'Course 2', term:"224"},
  { code: 'SE322', name: 'Course 3', term: "223" },
];
//error. we may need to go over the diff types of errors..
app.get('/',  async (req, res)=>{
 res.render('temp', {courses})
});

app.get('/display-course/:courseCode/:term', async (req, res) =>{
    const {courseCode, term} = req.params;
    try{
    const courseName = await ccModel.getCourseName(courseCode);
    const directSaved = await ccModel.getDirect(courseCode, term);
    const assignedWeights = {};
          // Assuming tuples is an array of tuples returned from the model
          directSaved.forEach(tuple => {
              const type = tuple.type;
              const weight = tuple.weight;
              assignedWeights[type] = weight;
          });
    const title = courseCode;
    res.render('cc', {title, courseCode, courseName, term, assignedWeights});
    } catch(error){
      console.error(error);
      res.render('error', {message: "course not found!"});
    }
    
  
});

app.get('/editActivities', (req, res)=>{
  res.render('editActivities');
})

app.post('/submit-form/:courseCode/:term', async (req, res)=>{

  const {courseCode, term} = req.params;

  //do we parseInt or math.floor or add a logic overall to prevent decimals? what is the best?
  const formData = {
    project: req.body.project === 'on' ? parseInt(req.body.project_weight) : null,
    major: req.body.major === 'on' ? parseInt(req.body.major_weight) : null,
    assignment: req.body.assignment === 'on' ? parseInt(req.body.assignment_weight) : null,
    quiz: req.body.quiz === 'on' ? parseInt(req.body.quiz_weight) : null,
    final_exam: req.body.final_exam === 'on' ? parseInt(req.body.final_exam_weight) : null,
    other: req.body.other === 'on' ? parseInt(req.body.other_weight) : null,
  };

      // Iterate over formData
      for (const [type, weight] of Object.entries(formData)) {
        // Check if weight is not null
        if (weight !== null) {
            try {
                // Call the saveDirectAssessment function
                await ccModel.addTypeAndWeight(courseCode, type, weight, term);
                res.render('temp', {courses});//todo: how about we tell the user they correctly saved the report instead ..
            } catch (error) {
                console.error(`Error saving direct assessment for type ${type}:`, error);
            }
        }
    }

  
 
})



app.use('/', courseReportRoutes);
app.use('/', cc);


app.use((req, res)=>{
  res.status(404).render('404error');
})

module.exports = app;
