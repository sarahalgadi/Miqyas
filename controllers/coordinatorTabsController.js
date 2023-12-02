const ccModel = require('../models/coordinatorModel');
const courseModel = require('../models/courseModel');


//loading the tabs of coordinator after clicking on viewing a course
async function getCoordinatedCourse (req,res) {
    const {courseCode, term} = req.params;
    try{
    const courseName = await courseModel.getCourseName(courseCode);
    const directSaved = await courseModel.getDirect(courseCode, term);
    const coordinatedSections = await ccModel.getCoordinatedSections(courseCode, term);
    const pastCoordinatedSemesters = await ccModel.getPastCourseReportSemesters(courseCode);
    const assignedWeights = {};
  
          // Assuming tuples is an array of tuples returned from the model
          directSaved.forEach(tuple => {
              const type = tuple.type;
              const weight = tuple.weight;
              assignedWeights[type] = weight;
          });
          //edited here ayat-------------------------------------------------------------------------------------------
    const title = 'Course: ' + courseCode;
    res.render('coordinator', {title, courseCode, courseName, term, assignedWeights, coordinatedSections, pastCoordinatedSemesters});
    } catch(error){
      console.error(error);
      res.render('error', {message: "Error: Could not retrieve course."});
    }
};

//we are saving the types of direct assessment & weights 
async function saveDirectAssessmentTypes (req, res){
        const {courseCode, term} = req.params;
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
              if (weight !== null && weight < 100) {
                  try {
                      // Call the saveDirectAssessment function
                      await ccModel.addTypeAndWeight(courseCode, type, weight, term);
                     
                  } catch (error) {
                      console.error(`Error: Could not save direct assessment for type ${type}:`, error);
                  }
              }
          }
          res.send('<script>alert("Successfully saved the direct assessment types!"); window.location.href = "/display-course/' + courseCode + '/' + term + '/'  + '";</script>');
        };

module.exports = {
    getCoordinatedCourse,
    saveDirectAssessmentTypes
}