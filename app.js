var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = process.env.PORT || 3000;
const app = express();
const pool = require('./database.js');
const bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const chairRouter = require('./routes/chairRouter');
const chairModel = require('./models/chairpersonModel.js');

app.get('/',async(req,res)=>{
  const department = "Software Engineering";
  const semester = 223; //we're gonna get them as req.params later.
  try{
    const facultyNames = await chairModel.getFullNameDepartment(department);
    const userNames = await chairModel.getUsernamesDepartment(department);
    res.render('roleAssign',{facultyNames, userNames, department, semester})
  } catch(error){
    console.error(error);
    res.render('error', {message: "course not found!"});
}});


app.get('/',async(req,res)=>{
  res.render('index')
});

app.use('/', chairRouter);



app.use((req, res)=>{
  res.status(404).render('error');
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
module.exports = app;

