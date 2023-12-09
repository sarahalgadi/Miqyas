const courseInstructorModel = require('../models/sectionModel');
const userModel = require('../models/UserModel');
const courseModel = require('../models/courseModel');
const studentModel = require('../models/studentModel');



//----------------------DIRECT ASSESSMENT------------------------------------------------------------------
//this is the table where instructors calculate overall clo achievement per student for each clo.. has to be saved into db.. for reports.
async function getDirectAssessmentResults(req,res) {


    const user = req.session.user;
    const {courseCode, term, section} = req.params;

    try{
      const userRoles = await userModel.getUserRoleQA(user.username)
      const userCourses = await userModel.getCourses(user.username, term);
      const studentInfo = await studentModel.getStudentInfo(courseCode, term, section);
      const learningOutcomes = await courseModel.getCLOInfo(courseCode, term);
      const CLOnumbers = learningOutcomes.CLOnumbers;
      const studentTotal = await studentModel.getDirectPerCLOPerStudent(courseCode, term, section);
      const courseName = await courseModel.getCourseName(courseCode);
      const title = "Direct Assessment: Grades";
      const CLOstatements = learningOutcomes.CLOstatements;
      const departments = await courseModel.getDepartments();
      const condition = true;
      let canAccess = false;
  
      if(userCourses){
        userCourses.forEach(function(course){
          if(course.courseCode == courseCode && course.sectionNumber == section)
            canAccess = true;
        });
      }
  
    res.render('directResults', {
      title,
      courseCode,
      term,
      section,
      courseName,
      studentInfo,
      CLOnumbers,
      studentTotal,
      CLOstatements,
      departments,
      condition,
      canAccess,
      userRoles  });

    } catch(error){
      res.render('error', {message: "Error: Could not fetch direct assessment results."})
    }
   
}


//for filtering results per section.. different route 
async function getDirectAssessmentResultsDepartment(req, res) {
  const user = req.session.user;
  const {courseCode, term, section, department} = req.params;

  try{
    const userCourses = await userModel.getCourses(user.username, term);
    const userRoles = await userModel.getUserRolesQA(user.username);
  
      if (department === 'All') {
          return res.redirect(`/directAssessmentResults/${courseCode}/${term}/${section}`);
        }
  
        const studentInfo = await studentModel.getStudentInfo(courseCode, term, section);
        const learningOutcomes = await courseModel.getCLOInfo(courseCode, term);
        const CLOnumbers = learningOutcomes.CLOnumbers;
        const studentTotal = await studentModel.getDirectPerCLOPerStudentDepartment(courseCode, term, section, department);
        const courseName = await courseModel.getCourseName(courseCode);
        const title = "Direct Assessment: Grades";
        const CLOstatements = learningOutcomes.CLOstatements;
        const departments = await courseModel.getDepartments();
        const condition = false; //i dont want to save the achievement levels per student from per department table.. will mess up the readings..
        let canAccess = false;
  
        if(userCourses){
          userCourses.forEach(function(course){
            if(course.courseCode == courseCode && course.sectionNumber == section)
              canAccess = true;
          });
        }
       
    
      res.render('directResults', {
        title,
        courseCode,
        term,
        section,
        courseName,
        studentInfo,
        CLOnumbers,
        studentTotal,
        CLOstatements,
        departments,
        condition,
        canAccess, 
        userRoles
      });
  } catch(error){
    res.render('error', {message: "Error: Could not fetch direct assessment results."})
  }
}

// saving clo percentage and category of each student.
  async function saveStudentActivities(req,res) {
    const{courseCode, term, section} = req.params;
    const formData = req.body;
    let students = formData.studentID;
    let cloNumbers = formData.cloNumbers;
    let cloPercentages = formData.cloPercentages

    //checking if theyre arrays or not..
    students = Array.isArray(students) ? students : [students];
    cloNumbers = Array.isArray(cloNumbers) ? cloNumbers : [cloNumbers];
    cloPercentages = Array.isArray(cloPercentages) ? cloPercentages : [cloPercentages];

    try{
      for(let i = 0; i< students.length; i++){
        let student = students[i];
        let cloNumber = cloNumbers[i];
        let cloPercentage = cloPercentages[i];
        let category = 0;
  
        //compute categories
        if(cloPercentage < 60){
          category = 0;
        } else if(cloPercentage < 70){
          category = 1;
        } else if(cloPercentage< 95){
          category = 2;
        } else {
          category = 3;
        }
  
        await studentModel.saveStudentCategories(courseCode, term, section, student, cloNumber, cloPercentage, category);
      }
      res.send('<script>alert("Successfully saved!"); window.location.href = "/directAssessmentResults/' + courseCode + '/' + term + '/' + section + '";</script>');

    }catch(error){
      res.render('error', {message: "Error: Could not save student achievement"});
    }
  }

  //this is for rendering the page for assinging grades for activities
  async function assignGrades(req, res){
    const user = req.session.user;
    const{courseCode, term, section} = req.params;
    const courseName = req.body.courseName;
    try{
      const userCourses = await userModel.getCourses(user.username, term);
      const directAssessment = await courseModel.getDirect(courseCode, term);
      const activities = directAssessment.map(item => item.type); // Extract just the activity names
      const assessmentDetails = await courseInstructorModel.getAssessmentDetails(courseCode, term, section);
      const CLOinfo = await courseModel.getCLOInfo(courseCode, term);
      const CLOnumbers = CLOinfo.CLOnumbers; 
      let canAccess = false;
      if(userCourses){
        userCourses.forEach(function(course){
          if(course.courseCode == courseCode && course.sectionNumber == section)
            canAccess = true;
        });
      }
      res.render('grades', {title:'Direct Assessment: Assign Grades', courseCode, term, section, courseName, activities, CLOnumbers, assessmentDetails, canAccess});
    } catch(error){
      res.render('error', {message:"Error: Could not retrieve activities for the course"})
    }  

  }


  // saving the question grades for different activities
  async function saveAssessment(req, res){
      const { courseCode, term, section} = req.params; 
      const formData= req.body;
      console.log(formData)

      try{
        let questions = formData["QNumber"];
        questions = Array.isArray(questions) ? questions : [questions];
        let description = formData["description"];
        description = Array.isArray(description) ? description : [description];
        let weight = formData["weight"];
        weight = Array.isArray(weight) ? weight : [weight];
        let cloMapped = formData["cloMapped"];
        cloMapped = Array.isArray(cloMapped) ? cloMapped : [cloMapped];
        let activityName = formData["activityName"];

        if(!weight){
          res.render('error', {message: "No weights have been set for the activity"});
        }

        //--------weight validation ---------------
        const userWeights = weight.map(w => parseInt(w));
          // Calculate the sum of user-inputted weights
        const sumOfUserWeights = userWeights.reduce((total, w) => total + w, 0);
         // Fetch saved activity weights from the database
        const directAssessment = await courseModel.getDirect(courseCode, term);
        const matchedActivity = directAssessment.find(item => item.type === activityName);

        if(matchedActivity.weight < sumOfUserWeights){
          res.send('<script>alert("Weights exceed the total expected weight of assessment activity"); window.location.href = "/assign-grades/' + courseCode + '/' + term + '/' + section + '";</script>');
        } else{
          for(let i = 0; i< description.length; i++){
            await courseInstructorModel.saveAssessmentDetails(courseCode, questions[i], description[i], parseInt(weight[i]), parseInt(cloMapped[i]), term, activityName, section);      
      }      res.send('<script>alert("Successfully saved!"); window.location.href = "/assign-grades/' + courseCode + '/' + term + '/' + section + '";</script>');

       }} catch (error) {
      res.render('error', {message:'Error: Failed to save assessment details. Please try again.'});
  }
}
  
//providing student grades interface rendered here
async function inputGrades(req, res){
  const user = req.session.user;
  const{courseCode, term, section} = req.params;
    const courseName = req.body.courseName;

    try{
      const directAssessment = await courseModel.getDirect(courseCode, term);
      const activities = directAssessment.map(item => item.type); // Extract just the activity names
      let students = await studentModel.getStudentInfo(courseCode, term, section);
      students = Array.isArray(students) ? students : [students];
      const assessmentDetails = await courseInstructorModel.getAssessmentDetails(courseCode, term, section);
      const userCourses = await userModel.getCourses(user.username, term);
      let canAccess = false;
      if(userCourses){
        userCourses.forEach(function(course){
          if(course.courseCode == courseCode && course.sectionNumber == section)
            canAccess = true;
        });
      }
      const studentGrades = await studentModel.getStudentGrades(courseCode, term, section, canAccess);
      res.render('studentgrades', {title:'Direct Assessment: Student Grades',courseCode, term, section, courseName, activities, students, assessmentDetails, studentGrades, canAccess});
    } catch(error){
      res.render('error', {message: "Error: Could not retrieve course activity data!"})
    }
}

//saving student's grade per each question 
async function saveGrades(req,res){
  //saving student grades after clicking save in studentgrades.ejs.. 
  //form data retrieves everything except clo percentage so calculation made in the server side.

  const {courseCode, term, section} = req.params;
  const formData = req.body;
  console.log("students...", formData)
  let grade = formData.grade; //student grades
  grade = Array.isArray(grade) ? grade : [grade];

  let students = formData.studentID;
  students = Array.isArray(students) ? students : [students];

  let assessmentNumbers = formData.assessmentNumber;
  assessmentNumbers = Array.isArray(assessmentNumbers) ? assessmentNumbers : [assessmentNumbers];

  let activity = formData.activity;
  activity = Array.isArray(activity)?  activity : [activity];
try{
  for(let i = 0; i<grade.length; i++){
    if(grade[i]!==''){// because it returns empty string if no grade was given.
      const studentGrade = parseFloat(grade[i]);
      const studentID = students[i];
      const assessmentNumber = parseInt(assessmentNumbers[i]);
      const type = activity[i];
      //i'll get the total weight to do division since percentage isn't extracted as it's dynamically scripted
      let total = await courseInstructorModel.getTotalWeightOfAQuestion(courseCode, term, section, type, assessmentNumber);
      //it returns it as an object w grade attribute
      const CLOPercentage = (studentGrade/ total.grade * 100).toFixed(2);
      console.log(CLOPercentage);

      //now we're gonna save into student_direct_assessment

      await studentModel.saveStudentAveragePerQuestion(type, courseCode, assessmentNumber, studentID, studentGrade, CLOPercentage, term, section);
  }

}
res.send('<script>alert("Successfully saved!"); window.location.href = "/input-grades/' + courseCode + '/' + term + '/' + section + '";</script>');
  console.log("saved!")
  } catch(error){
    res.render('error', {message: "Error: Could not save student's achievement per question!"})
  } 
}

async function deleteAssessmentDetails(req, res){
  const{courseCode, term, section} = req.params;
  const qnumber = req.body.qNumber;
  const activity = req.body.activity;
  const clo = req.body.cloNumber;

  try{
    await courseInstructorModel.deleteAssessmentDetails(courseCode, section, term, activity, qnumber, clo);
    res.status(200).json({ message: 'Assessment detail deleted successfully' });
      } catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

//---------------------------------------------------------------------------------------------------
//------------------------INDIRECT ASSESSMENT--------------------------------------------------------

//this is for viewing the page that makes the instructor upload the indirect assessment survey
async function indirectAssessment(req, res) { 
  const user = req.session.user;
  const {courseCode, term, section} = req.params;
  const courseName = req.body.courseName;
  const userCourses = await userModel.getCourses(user.username, term);
  let canAccess = false;
  try{
    if(userCourses){
      userCourses.forEach(function(course){
        if(course.courseCode == courseCode && course.sectionNumber == section)
          canAccess = true;
      });
    }
    res.render('indirectAssessment', { title: 'Indirect Assessment', courseCode, section, term, courseName, message: '', canAccess});
  } catch(error){
    res.render('error', {message: "You are not allowed to access this page!"})
  }
  

}


async function saveIndirectAssessment(req, res) {
      const formData =req.body;
      const CLONumber = formData['CLONumber'];
      const courseCode = formData['courseCode'];
      const semester = formData['semester'];
      const sectionNumber = formData['sectionNumber'];
      const NumFullySatisfied = formData['NumFullySatisfied'];
      const NumAdequatelySatisfied = formData['NumAdequatelySatisfied'];
      const NumSatisfied = formData['NumSatisfied'];
      const NumBarelySatisfied = formData['NumBarelySatisfied'];
      const NumNotSatisfied =formData['NumNotSatisfied'];

      

  try {
      console.log("formdata", req.body);
      for(let i=0; i< CLONumber.length; i++){
          const CLO = parseInt(CLONumber[i]);
          const full = parseInt(NumFullySatisfied[i]);
          const adequate = parseInt(NumAdequatelySatisfied[i]);
          const satisfied = parseInt(NumSatisfied[i]);
          const barely = parseInt(NumBarelySatisfied[i]);
          const not = parseInt(NumNotSatisfied[i]);

          await courseInstructorModel.saveIndirectAssessmentData(CLO, courseCode, semester, sectionNumber, full, adequate, satisfied, barely, not);
      }

      await courseInstructorModel.saveIndirectAssessmentData(
          CLONumber,
          courseCode,
          semester,
          sectionNumber,
          NumFullySatisfied,
          NumAdequatelySatisfied,
          NumSatisfied,
          NumBarelySatisfied,
          NumNotSatisfied
      );
      //then redirecting to success page to indicate this process is complete
      console.log('Indirect Assessment Results Saved Successfully!');
      res.render('success', {title: 'Success!', message:'Indirect Assessment Results Saved Successfully!'});
  } catch (error) {
      res.render('error', {message: "Error: Could not save course exit survey data."})
  }
}





module.exports = {
    getDirectAssessmentResults,
    getDirectAssessmentResultsDepartment,
    saveStudentActivities,
    assignGrades,
    saveAssessment,
    inputGrades,
    saveGrades,
    saveIndirectAssessment,
    indirectAssessment,
    deleteAssessmentDetails
}