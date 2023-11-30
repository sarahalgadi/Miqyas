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
    const assessmentDetails = await courseInstructorModel.getAssessmentDetails(courseCode, term, section);
    console.log(assessmentDetails);
    const CLOinfo = await courseInstructorModel.getCLOInfo(courseCode, term);
    const CLOnumbers = CLOinfo.CLOnumbers;
    directAssessment.forEach(tuple => {
        const type = tuple.type;

    });

    res.render('grades', {title:'Direct Assessment: Assign Grades', courseCode, term, section, courseName, activities, CLOnumbers, assessmentDetails});
  }

  async function saveAssessment(req, res){
      const { courseCode, term, section} = req.params; 
      const formData= req.body;
      console.log(formData)

      try{
        //fix: we need to make sur etheyre arrays!!!!!! use the same function as sara!!!!
        const questions = formData.QNumber;
        const description = formData.description;
        const weight = formData.weight;
        const cloMapped = formData.cloMapped;
        const activityName = formData.activityName;

        for(let i = 0; i< questions.length; i++){
            await courseInstructorModel.saveAssessmentDetails(courseCode, parseInt(questions[i]), description[i], parseInt(weight[i]), parseInt(cloMapped[i]), term, activityName, section);
              
      }

      res.send('<script>alert("Successfully saved!"); window.location.href = "/assign-grades/' + courseCode + '/' + term + '/' + section + '";</script>');
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

    let students = await courseInstructorModel.getStudentInfo(courseCode, term, section);
    students = Array.isArray(students) ? students : [students];
    const assessmentDetails = await courseInstructorModel.getAssessmentDetails(courseCode, term, section);
    console.log("students", students);
    console.log("assessmentDetails", assessmentDetails);

    const studentGrades = await courseInstructorModel.getStudentGrades(courseCode, term, section);

    res.render('studentgrades', {title:'Direct Assessment: Student Grades',courseCode, term, section, courseName, activities, students, assessmentDetails, studentGrades});
}

async function saveGrades(req,res){
  //saving student grades after clicking save in studentgrades.ejs.. 
  //form data retrieves everything except clo percentage.. even when i put input hidden.. so i decided to retrieve total then do calculation

  const {courseCode, term, section} = req.params;
  const formData = req.body;
  console.log("students...", formData)
  let grade = formData.grade;
  grade = Array.isArray(grade) ? grade : [grade];
try{
  for(let i = 0; i<grade.length; i++){
    if(grade[i]!==''){// because it returns empty string if no grade was given.
      const studentGrade = parseFloat(grade[i]);
      const studentID = formData.studentID[i];
      const assessmentNumber = parseInt(formData.assessmentNumber[i]);
      const type = formData.activity[i];
      //i'll get the total weight to do division since percentage isn't extracted as it's dynamically scripted

      let total = await courseInstructorModel.getTotalWeightOfAQuestion(courseCode, term, section, type, assessmentNumber);
      //it returns it as an object w grade attribute
      const CLOPercentage = (studentGrade/ total.grade * 100).toFixed(2);
      console.log(CLOPercentage);

      //now we're gonna save into student_direct_assessment

      await courseInstructorModel.saveStudentAveragePerQuestion(type, courseCode, assessmentNumber, studentID, studentGrade, CLOPercentage, term, section);

  }

}
res.send('<script>alert("Successfully saved!"); window.location.href = "/input-grades/' + courseCode + '/' + term + '/' + section + '";</script>');
  console.log("saved!")
  } catch(error){
    res.render('error', {message: "could not save student's achievement per question!"})
  }

  
}

async function renderCourseDetails(req, res) {
  const {courseCode, term, section} = req.params;
  const courseName = req.body.courseName;
  res.render('indirectAssessment', { title: 'Indirect Assessment', courseCode, section, term, courseName, message: '' });

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
      console.error('Error saving data:', error);
  }
}




module.exports = {
    getGradesPage,
    getDirectAssessmentResults,
    getDirectAssessmentResultsDepartment,
    saveStudentActivities,
    assignGrades,
    saveAssessment,
    inputGrades,
    saveGrades,
    saveIndirectAssessment,
    renderCourseDetails
}