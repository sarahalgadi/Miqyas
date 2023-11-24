const sectionReportModel = require('../models/sectionReport');
//todo: error handling..
//same controller as edit section report but without saving.. im just doing this bc viewing is in a separate ejs file.
//todo: we need to add a code part which checks if there are entries in directclo_per_section
//todo: because that table is the only proof we have that the instructor submitted the final section report.. 
//todo: if the instructor did not.. we should render a page that says "no section report submitted!"
async function viewSectionReport(req, res){
    const {courseCode, term, section} = req.params;

    try{
        const courseName = await sectionReportModel.getCourseName(courseCode);
        const title = 'Section Report';
        const CLOs = await sectionReportModel.getCLOInfo(courseCode, term);
        const CLOnumbers = CLOs.CLOnumbers;
        const CLOstatements = CLOs.CLOstatements;
        const categoryCounts = await sectionReportModel.getCategoryCounts(courseCode, term, section); //per section
        const resultsPerCLO = calculateResultsPerCLO(categoryCounts); //direct assessment per clo per section.
        const departments = await sectionReportModel.getDepartments();
        const indirectSums = await sectionReportModel.getIndirectPerCLOPerSection(courseCode, term, section);
        const totalIndirectPerCLO = calculateOverallSatisfaction(indirectSums);
        const condition = true; // this is for the submit button..explanation in the function below (per deparmtnet)
        const actionPlans = await sectionReportModel.getActionPlans(courseCode, term, section);
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
        const courseName = await sectionReportModel.getCourseName(courseCode);
        const title = 'Section Report';
        const CLOs = await sectionReportModel.getCLOInfo(courseCode, term);
        const CLOnumbers = CLOs.CLOnumbers;
        const CLOstatements = CLOs.CLOstatements;
        const categoryCounts = await sectionReportModel.getCategoryCounts(courseCode, term, section, department); //per section
        const resultsPerCLO = calculateResultsPerCLO(categoryCounts); //direct assessment per clo per section.
        const departments = await sectionReportModel.getDepartments();
        const indirectSums = await sectionReportModel.getIndirectPerCLOPerSection(courseCode, term, section);
        const totalIndirectPerCLO = calculateOverallSatisfaction(indirectSums);
        const condition = false; //i want to disable the submit button when we're displaying by department so that resultsPerCLO aren't saved into the db per department.. 
        //bc clicking on the submit button will save resultsperclo into the direct per section.. if we use per department.. inaccurate results overwriting original one!
        const actionPlans = await sectionReportModel.getActionPlans(courseCode, term, section);
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

//calculation for each category (coutning me and ae. this is not exported.)

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
//calculation for indirect.. per section results..
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