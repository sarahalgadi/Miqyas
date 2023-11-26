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




module.exports = {
    getGradesPage,
    getDirectAssessmentResults,
    getDirectAssessmentResultsDepartment
}