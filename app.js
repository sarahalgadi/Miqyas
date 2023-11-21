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

const connectDatabase = require('./database');

const database = connectDatabase();

// Now you can use the 'database' object for your queries or operations


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const courseReport = require('./models/courseReport')



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

app.get('/display-course', (req, res) =>{
  const selectedCourseCode = req.query.courseCode;
  const selectedCourseName = courses.find(course =>
    course.code === selectedCourseCode);
  if (selectedCourseName){
    const courseName = selectedCourseName.name;
    const term = selectedCourseName.term;
    const courseCode = selectedCourseCode;
    res.render('cc', {courseCode, courseName, term});
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

app.get('/course-report/:courseCode/:term', async (req, res) => {
  const { courseCode, term } = req.params;

  try {
    const courseName = await courseReport.getCourseName(courseCode);

    if (courseName) {
      const learningOutcomes = await courseReport.getCLOInfo(courseCode, term);
      const categoryCounts = await courseReport.getCategoryCounts(courseCode, term);
      const departments = await courseReport.getDepartments();
      const indirectSums = await courseReport.calculateIndirectPerCLO(courseCode, term);
      console.log(indirectSums);
      const actionPlans = await courseReport.getActionPlan(courseCode, term);
      //total for all . indirect.
      const totalIndirectPerCLO =  calculateOverallSatisfaction(indirectSums);
      console.log('totalIndirectPerCLO:', totalIndirectPerCLO);

      console.log('CLONUMBERS:', learningOutcomes.CLOnumbers);

      // Calculate results for each CLO number. for direct.
      const resultsPerCLO = calculateResultsPerCLO(categoryCounts);
     

      res.render('courseReport', {
        courseCode,
        term,
        courseName,
        CLOstatements: learningOutcomes.CLOstatements,
        CLOnumbers: learningOutcomes.CLOnumbers,
        categoryCounts,
        departments,
        resultsPerCLO,
        indirectSums,
        actionPlans,
        totalIndirectPerCLO
      });
    } else {
      res.render('error', { message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Internal Server Error' });
  }
});




app.get('/course-report/:courseCode/:term/:department', async (req, res) => {
  const { courseCode, term, department } = req.params;

  if (department === 'All') {
    return res.redirect(`/course-report/${courseCode}/${term}`);
  }

  try {
    const courseName = await courseReport.getCourseName(courseCode);

    if (courseName) {
      const learningOutcomes = await courseReport.getCLOInfo(courseCode, term);
      const categoryCounts = await courseReport.getCategoryCounts(courseCode, term, department);
      const departments = await courseReport.getDepartments();
      const indirectSums = await courseReport.calculateIndirectPerCLO(courseCode, term);
      const actionPlans = await courseReport.getActionPlan(courseCode, term);
      const totalIndirectPerCLO = calculateOverallSatisfaction(indirectSums);


      // Calculate results for each CLO number
      const resultsPerCLO = calculateResultsPerCLO(categoryCounts);

      res.render('courseReport', {
        courseCode,
        term,
        courseName,
        CLOstatements: learningOutcomes.CLOstatements,
        CLOnumbers: learningOutcomes.CLOnumbers,
        categoryCounts,
        departments,
        resultsPerCLO,
        indirectSums,
        actionPlans,
        totalIndirectPerCLO
      });
    } else {
      res.render('error', { message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Internal Server Error' });
  }
});

function calculateResultsPerCLO(categoryCounts) {
  const resultsPerCLO = {};

  for (const data of categoryCounts) {
    const { CLONumber, category, studentCount } = data;

    if (!resultsPerCLO[CLONumber]) {
      resultsPerCLO[CLONumber] = { me: 0, ae: 0, totalStudentCount: 0 };
    }

    // Sum ME and AE counts
    if (category === 2) {
      resultsPerCLO[CLONumber].me += studentCount;
    } else if (category === 3) {
      resultsPerCLO[CLONumber].ae += studentCount;
    }

    // Sum total student count for all categories
    resultsPerCLO[CLONumber].totalStudentCount += studentCount;
  }

  // Calculate the results for each CLO
  for (const cloNumber in resultsPerCLO) {
    const { me, ae, totalStudentCount } = resultsPerCLO[cloNumber];
    resultsPerCLO[cloNumber].results = totalStudentCount > 0 ? ((me + ae) * 100) / totalStudentCount : 0;
  }

  return resultsPerCLO;
}

 function calculateOverallSatisfaction(indirectSums) {
  const overallSatisfactionPerCLO = {};

  for (const data of indirectSums) {
    const {
      CLONumber,
      totalFullySatisfied,
      totalAdequatelySatisfied,
      totalSatisfied,
      totalBarelySatisfied,
      totalNotSatisfied
    } = data;

    const totalSatisfactionCount =
    parseInt(totalFullySatisfied) +
    parseInt(totalAdequatelySatisfied) +
    parseInt(totalSatisfied) +
    parseInt(totalBarelySatisfied) +
    parseInt(totalNotSatisfied);
  

    if (totalSatisfactionCount > 0) {
      const overallSatisfaction =
      (parseInt(totalFullySatisfied) + parseInt(totalAdequatelySatisfied)) / totalSatisfactionCount;

      
      overallSatisfactionPerCLO[CLONumber] = (overallSatisfaction * 100).toFixed(2);
    } else {
      // Handle division by zero or no data
      overallSatisfactionPerCLO[CLONumber] = 0;
    }
  }

  return overallSatisfactionPerCLO;
}




app.post('/save-course-report/:courseCode/:term', async (req, res) => {
  try {
    console.log(req.body)
    const { courseCode, term } = req.params;
    console.log(courseCode, term)
    const username = "rjan"; //coordinator name is takenthru session mgmnt.. im just using a placeholder 
    const recommendation = req.body.recommendation.trim();
    
    // Update the recommendation table
    await courseReport.saveRecommendation(courseCode, term, username, recommendation);

    // Update the selected action plans
    await courseReport.updateSelectedActionPlans(courseCode, term, req.body);

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('error', {message: 'could not save the course report'});
  }
});

app.use((req, res)=>{
  res.status(404).render('404error');
})

module.exports = app;
