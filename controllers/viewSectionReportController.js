const sectionReportModel = require('../models/sectionReportModel');
const courseModel = require('../models/courseModel');
const { calculateResultsPerCLO } = require('./utils');
const { calculateOverallSatisfaction} = require('./utils');


//same controller as edit section report but without saving.. im just doing this bc viewing is in a separate ejs file.

async function viewSectionReport(req, res){
    const {courseCode, term, section} = req.params;

    try{
        const courseName = await courseModel.getCourseName(courseCode);
        const title = 'Section Report';
        const CLOs = await courseModel.getCLOInfo(courseCode, term);
        const CLOnumbers = CLOs.CLOnumbers;
        const CLOstatements = CLOs.CLOstatements;
        const categoryCounts = await sectionReportModel.getCategoryCounts(courseCode, term, section); //per section
        const resultsPerCLO = calculateResultsPerCLO(categoryCounts); //direct assessment per clo per section.
        const departments = await courseModel.getDepartments();
        const indirectSums = await sectionReportModel.getIndirectPerCLOPerSection(courseCode, term, section);
        const totalIndirectPerCLO = calculateOverallSatisfaction(indirectSums);
        const condition = true; // this is for the submit button..explanation in the function below (per deparmtnet)
        const actionPlans = await sectionReportModel.getSectionActionPlans(courseCode, term, section);
        console.log(actionPlans);

        // Separate data into arrays for rendering in the histogram script.. inefficient but i had to hardcode this to make it work.
        const [clohisto, indirecthisto, directhisto] = prepareHistogramData(
            CLOnumbers,
            totalIndirectPerCLO,
            resultsPerCLO
          );
        console.log(resultsPerCLO);
        
        res.render('viewSectionReport',{
        title,
        courseCode,
        term,
        section,
        courseName,
        CLOnumbers,
        CLOstatements,
        categoryCounts,
        resultsPerCLO,
        departments,
        indirectSums,
        totalIndirectPerCLO,
        clohisto,
        indirecthisto,
        directhisto,
        condition,
        actionPlans
        } );
    }catch (error){
        console.error(error);
        res.render('error', {message: "failed to retrieve course section report"});
    }
}




//this is for the route's filtering
async function viewSectionReportDepartment(req, res){
    const {courseCode, term, section, department} = req.params;
    if (department === 'All') {
        return res.redirect(`/view-section-report/${courseCode}/${term}/${section}`);
      }
    

    try{
        const courseName = await courseModel.getCourseName(courseCode);
        const title = 'Section Report';
        const CLOs = await courseModel.getCLOInfo(courseCode, term);
        const CLOnumbers = CLOs.CLOnumbers;
        const CLOstatements = CLOs.CLOstatements;
        const categoryCounts = await sectionReportModel.getCategoryCounts(courseCode, term, section, department); //per section
        const resultsPerCLO = calculateResultsPerCLO(categoryCounts); //direct assessment per clo per section.
        const departments = await courseModel.getDepartments();
        const indirectSums = await sectionReportModel.getIndirectPerCLOPerSection(courseCode, term, section);
        const totalIndirectPerCLO = calculateOverallSatisfaction(indirectSums);
        const condition = false; //i want to disable the submit button when we're displaying by department so that resultsPerCLO aren't saved into the db per department.. 
        //bc clicking on the submit button will save resultsperclo into the direct per section.. if we use per department.. inaccurate results overwriting original one!
        const actionPlans = await sectionReportModel.getSectionActionPlans(courseCode, term, section);
          // Calculate results for all depts (just for the histogram's direct assessment)
          const allcategory = await sectionReportModel.getCategoryCounts(courseCode, term, section);
          const histo = calculateResultsPerCLO(allcategory);
          const [clohisto, indirecthisto, directhisto] = prepareHistogramData(
            CLOnumbers,
            totalIndirectPerCLO,
            histo
          );

        res.render('viewSectionReport',{
        title,
        courseCode,
        term,
        section,
        courseName,
        CLOnumbers,
        CLOstatements,
        categoryCounts,
        resultsPerCLO,
        departments,
        indirectSums,
        totalIndirectPerCLO,
        clohisto,
        indirecthisto,
        directhisto,
        condition,
        actionPlans
        } );
    }catch (error){
        console.error(error);
        res.render('error', {message: "failed to retrieve course section report"});
    }
}



  //function for getting histogram data as arrays to be able to render it properly..
  function prepareHistogramData(clonums,indirectSums, resultsPerCLO) {
    const clonumbers = [];
    const indirectResults = [];
    const directResults = [];
  
    // Iterate over the CLO numbers
    for (const cloNumber of clonums) {
      // Get the indirect result for the CLO number
      const indirectResult = parseFloat(indirectSums[cloNumber])|| 0;
      indirectResults.push(indirectResult);
  
      // Get the direct result for the CLO number
      const directResult = resultsPerCLO[cloNumber] ? resultsPerCLO[cloNumber].results.toFixed(2) : 0;
      directResults.push(directResult);
      clonumbers.push(cloNumber);
    }
    return [clonumbers, indirectResults, directResults];
  }

  



  

module.exports = {
    viewSectionReport,
    viewSectionReportDepartment,
    
}