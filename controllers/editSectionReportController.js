const sectionReportModel = require('../models/sectionReportModel');
const courseModel = require('../models/courseModel');

//todo: error handling here as well .. and saving course section report.. what happens then?
//fixme: saving report.. i did not redirect anywhere.. we need to figure this out.
async function editSectionReport(req, res){
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

        // Separate data into arrays for rendering in the histogram script.. inefficient but i had to hardcode this to make it work.
        const [clohisto, indirecthisto, directhisto] = prepareHistogramData(
            CLOnumbers,
            totalIndirectPerCLO,
            resultsPerCLO
          );
        console.log(resultsPerCLO);
        
        res.render('editSectionReport',{
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
async function editSectionReportDepartment(req, res){
    const {courseCode, term, section, department} = req.params;
    if (department === 'All') {
        return res.redirect(`/edit-section-report/${courseCode}/${term}/${section}`);
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

        res.render('editSectionReport',{
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

  async function saveSectionReport(req, res){

    let {courseCode, term, section} = req.params;

    section = parseInt(section);
    
    //saving action plan!

    const actionPlanData = JSON.parse(req.body.allActionPlanData);
    
       for (const plan of actionPlanData) {
        console.log("this is plan:", plan);
        let statement = plan.statement;
        let resources = plan.resources;
        let startDate = plan.startDate;
        let endDate = plan.endDate;
        let responsible = plan.responsible;
        let cloNumber = parseInt(plan.cloNumber);


        // Check and handle undefined values
         statement = statement !== undefined ? statement : "none";
         resources = resources !== undefined ? resources : null;
        startDate = startDate !== undefined && startDate !== "" ? startDate : null;
         endDate = endDate !== undefined && endDate !== "" ? endDate : null;
        responsible = responsible !== undefined ? responsible : null;

        try {
            await sectionReportModel.saveActionPlan(
                statement,
                resources,
                startDate,
                endDate,
                responsible,
                courseCode,
                section,
                term,
                parseInt(cloNumber)
            );
        } catch (error) {
            console.error('Error saving action plan:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
    }
    //saving directclo_per_section

    const calculatedResults = JSON.parse(req.body.calculatedResults);
    for (const cloNumber in calculatedResults) {
        const cloData = calculatedResults[cloNumber];
     try {
        await sectionReportModel.saveDirectCLOPerSection( ////fixme: AFTER SAVING REPORT, what to render?????  we need to discuss this
            parseInt(cloNumber),
            courseCode,
            section,
            cloData.results.toFixed(2), 
            term
        );
    } catch (error) {
        // Handle the error appropriately (e.g., log or send an error response)
        console.error('Error saving direct CLO per section:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return; // Stop processing further if an error occurs
    }

}
   
    }

    async function deleteActionPlan (req,res) {
      console.log("i am here again :(")
      const courseCode = req.params.courseCode;
      const sectionNumber = req.params.sectionNumber; 
      const semester= req.params.term;
      const CLONumber= req.body.cloNumber;
      console.log(courseCode,sectionNumber,semester,CLONumber)
      try{
        await sectionReportModel.deleteActionPlan(courseCode, sectionNumber, semester, CLONumber);
        res.render('index')
      } catch(error){
        console.error(error);
        res.render('error', {message: "didnt work lol"});
      }
    };
    



  

module.exports = {
    editSectionReport,
    editSectionReportDepartment,
    saveSectionReport,
    deleteActionPlan
}