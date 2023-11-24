const ccModel = require('../models/cc');

const courses = [
    { code: 'COURSE001', name: 'Course 1', term: "223"},
    { code: 'COURSE002', name: 'Course 2', term:"224"},
    { code: 'SE322', name: 'Course 3', term: "223" },
  ];
  const name = 'SE322';
  //fixme: this is just for temp... it iwll be removed.

async function getCoordinatedCourse (req,res) {
    const {courseCode, term} = req.params;
    try{
    const courseName = await ccModel.getCourseName(courseCode);
    const directSaved = await ccModel.getDirect(courseCode, term);
    const coordinatedSections = await ccModel.getCoordinatedSections(courseCode, term);
    const pastCoordinatedSemesters = await ccModel.getPastCourseReportSemesters(courseCode);
    const assignedWeights = {};
    console.log(coordinatedSections);
          // Assuming tuples is an array of tuples returned from the model
          directSaved.forEach(tuple => {
              const type = tuple.type;
              const weight = tuple.weight;
              assignedWeights[type] = weight;
          });
    const title = courseCode;
    res.render('cc', {title, courseCode, courseName, term, assignedWeights, coordinatedSections, pastCoordinatedSemesters});
    } catch(error){
      console.error(error);
      res.render('error', {message: "course not found!"});
    }
};

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
              if (weight !== null) {
                  try {
                      // Call the saveDirectAssessment function
                      await ccModel.addTypeAndWeight(courseCode, type, weight, term);
                     
                  } catch (error) {
                      console.error(`Error saving direct assessment for type ${type}:`, error);
                  }
              }
          }
          res.render('temp', {courses, name});//todo: how about we tell the user they correctly saved the report instead ..
};

module.exports = {
    getCoordinatedCourse,
    saveDirectAssessmentTypes
}