const courseInstructorModel = require('../models/courseInstructor');


async function getGradesPage(req, res) {
    const {courseCode, term, section} = req.params;

    const directAssessment = await courseInstructorModel.getDirectAssessmentTypes(courseCode, term);
    const assignedWeights = {};
    directAssessment.forEach(tuple => {
        const type = tuple.type;
        const weight = tuple.weight;
        assignedWeights[type] = weight;
    });

    const studentInfo = await courseInstructorModel.getStudentInfo(courseCode, term, section);

    res.render('instructor',  {assignedWeights, studentInfo});
}

async function getDirectAssessmentResults(req,res) {
    const {courseCode, term, section} = req.params;
    const studentInfo = await courseInstructorModel.getStudentInfo(courseCode, term, section);
    const learningOutcomes = await courseInstructorModel.getCLOInfo(courseCode, term);
    const CLOnumbers = learningOutcomes.CLOnumbers;
    const categoryCounts = await courseInstructorModel.getCategoryCounts(courseCode, term, section);
    const resultsPerCLO = calculateResultsPerCLO(categoryCounts);
    const studentTotal = await courseInstructorModel.getDirectPerCLOPerStudent(courseCode, term, section);
    const courseName = await courseInstructorModel.getCourseName(courseCode);
    const title = "Direct Assessment: Grades";
    const CLOstatements = learningOutcomes.CLOstatements;
    const departments = await courseInstructorModel.getDepartments();

    //category ae, me, be etc..
  
  res.render('directResults', {
    title,
    courseCode,
    term,
    section,
    courseName,
    studentInfo,
    CLOnumbers,
    categoryCounts,
    resultsPerCLO,
    studentTotal,
    CLOstatements,
    departments
  });
   
}
//for filtering results per section.. different route lol
async function getDirectAssessmentResultsDepartment(req, res) {
    const {courseCode, term, section, department} = req.params;

    if (department === 'All') {
        return res.redirect(`/directAssessmentResults/${courseCode}/${term}/${section}`);
      }


      const studentInfo = await courseInstructorModel.getStudentInfo(courseCode, term, section);
      const learningOutcomes = await courseInstructorModel.getCLOInfo(courseCode, term);
      const CLOnumbers = learningOutcomes.CLOnumbers;
      const categoryCounts = await courseInstructorModel.getCategoryCounts(courseCode, term, section);
      const resultsPerCLO = calculateResultsPerCLO(categoryCounts);
      const studentTotal = await courseInstructorModel.getDirectPerCLOPerStudentDepartment(courseCode, term, section, department);
      const courseName = await courseInstructorModel.getCourseName(courseCode);
      const title = "Direct Assessment: Grades";
      const CLOstatements = learningOutcomes.CLOstatements;
      const departments = await courseInstructorModel.getDepartments();


  
    res.render('directResults', {
      title,
      courseCode,
      term,
      section,
      courseName,
      studentInfo,
      CLOnumbers,
      categoryCounts,
      resultsPerCLO,
      studentTotal,
      CLOstatements,
      departments      
    });
}


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

  async function saveStudentActivities(req,res) {
    const{courseCode, term, section} = req.params;
    const formData = req.body;
    const students = formData.studentID;
    const cloNumbers = formData.cloNumbers;
    const cloPercentages = formData.cloPercentages
    try{
      for(let i = 0; i< students.length; i++){
        let student = students[i];
        let cloNumber = cloNumbers[i];
        let cloPercentage = cloPercentages[i];
        let category = 0;
  
        if(cloPercentage < 60){
          category = 0;
        } else if(cloPercentage < 70){
          category = 1;
        } else if(cloPercentage< 95){
          category = 2;
        } else {
          category = 3;
        }
  
        await courseInstructorModel.saveStudentCategories(courseCode, term, section, student, cloNumber, cloPercentage, category);
      }
      res.send('<script>alert("Successfully saved!"); window.location.href = "/directAssessmentResults/' + courseCode + '/' + term + '/' + section + '";</script>');

    }catch(error){
      res.render('error', {message: "could not save the students' data.."});
    }
    
      
       
       
      }

  //this is for rendering the page for assinging grades for activities
  async function assignGrades(req, res){
    const{courseCode, term, section} = req.params;
    const courseName = req.body.courseName;
    const directAssessment = await courseInstructorModel.getDirectAssessmentTypes(courseCode, term);
    const activities = directAssessment.map(item => item.type); // Extract just the activity names
    // Extract the courseName 
    const assignedWeights = {};
    const CLOinfo = await courseInstructorModel.getCLOInfo(courseCode, term);
    const CLOnumbers = CLOinfo.CLOnumbers;
    directAssessment.forEach(tuple => {
        const type = tuple.type;

    });

    res.render('grades', {title:'Direct Assessment: Assign Grades', courseCode, term, section, courseName, activities, CLOnumbers});
  }

  async function saveGrades(req, res){
      const { courseCode, term, section} = req.params; 
      const formData= req.body;

      try{
        const questions = formData.QNumber;
        const description = formData.description;
        const weight = formData.weight;
        const cloMapped = formData.cloMapped;
        const activityName = formData.activityName;

        for(let i = 0; i< questions.length; i++){
          
          if (questions[i] !== '' && weight[i] !== '' && cloMapped[i] !== '') {
            await courseInstructorModel.saveAssessmentDetails(courseCode, parseInt(questions[i]), description[i], parseInt(weight[i]), parseInt(cloMapped[i]), term, activityName, section);
        }        
      }

      res.send('<script>alert("Successfully saved!"); window.location.href = "/input-grades/' + courseCode + '/' + term + '/' + section + '";</script>');
  } catch (error) {
      res.render('error', {message:'Failed to save assessment details! please try again'});
      console.error(error)
  }
}
  
  
async function inputGrades(req, res){
  const{courseCode, term, section} = req.params;
    const courseName = req.body.courseName;
    const directAssessment = await courseInstructorModel.getDirectAssessmentTypes(courseCode, term);
    const activities = directAssessment.map(item => item.type); // Extract just the activity names

    const students = await courseInstructorModel.getStudentInfo(courseCode, term, section);
    const assessmentDetails = await courseInstructorModel.getAssessmentDetails(courseCode, term, section);

    res.render('studentgrades', {title:'Direct Assessment: Student Grades',courseCode, term, section, courseName, activities, students, assessmentDetails});
}




module.exports = {
    getGradesPage,
    getDirectAssessmentResults,
    getDirectAssessmentResultsDepartment,
    saveStudentActivities,
    assignGrades,
    saveGrades,
    inputGrades
}