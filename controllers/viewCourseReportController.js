const courseReportModel = require('../models/courseReportModel');
const courseModel = require('../models/courseModel')
//todo: error handling here...  etc.
//viewing course report..editing..
//NOTEEEE: this is different from courseReport controller in many details that matter in ejs. that's why
//i separated them :)
async function viewCourseReport(req, res) {
    const { courseCode, term } = req.params;
  
    try {
      const courseName = await courseModel.getCourseName(courseCode);
  
      if (courseName) {
        const learningOutcomes = await courseModel.getCLOInfo(courseCode, term);
        const categoryCounts = await courseReportModel.getCourseCategoryCounts(courseCode, term);
        const departments = await courseModel.getDepartments();
        const indirectSums = await courseReportModel.calculateIndirectPerCLO(courseCode, term);
        const actionPlans = await courseReportModel.getSelectedActionPlan(courseCode, term);
        
        // Total for all indirect assessments
        const totalIndirectPerCLO = calculateOverallSatisfaction(indirectSums);
  
        // Calculate results for each CLO number for direct assessments
        const resultsPerCLO = calculateResultsPerCLO(categoryCounts);
  
        // Separate data into arrays for rendering
        const [clohisto, indirecthisto, directhisto] = prepareHistogramData(
          learningOutcomes.CLOnumbers,
          totalIndirectPerCLO,
          resultsPerCLO
        );
  
        // Get recommendation if it exists, as well as action plan
        const recommendation = await courseReportModel.getRecommendation(courseCode, term);
  
        res.render('viewCourseReport', {
          title: 'Course Report', //ayat i passed title here to render in page--------------
          courseCode,
          term,
          courseName,
          CLOstatements: learningOutcomes.CLOstatements,
          CLOnumbers: learningOutcomes.CLOnumbers,
          categoryCounts,
          departments,
          resultsPerCLO,
          indirectSums,
          actionPlans,
          totalIndirectPerCLO,
          clohisto,
          directhisto,
          indirecthisto,
          recommendation
        });
      } else {
        res.render('error', { message: 'Course not found' });
      }
    } catch (error) {
      console.error(error);
      res.render('error', { message: 'Internal Server Error' });
    }
  }

  async function displayByDepartment(req, res) {
    const { courseCode, term, department } = req.params;
  
    if (department === 'All') {
      return res.redirect(`/view-course-report/${courseCode}/${term}`);
    }
  
    try {
      const courseName = await courseModel.getCourseName(courseCode);
  
      if (courseName) {
        const learningOutcomes = await courseModel.getCLOInfo(courseCode, term);
        const categoryCounts = await courseReportModel.getCourseCategoryCounts(courseCode, term, department);
        const departments = await courseModel.getDepartments();
        const indirectSums = await courseReportModel.calculateIndirectPerCLO(courseCode, term);
        const actionPlans = await courseReportModel.getSelectedActionPlan(courseCode, term);
        const totalIndirectPerCLO = calculateOverallSatisfaction(indirectSums);
  
        // Calculate results for each CLO number per department
        const resultsPerCLO = calculateResultsPerCLO(categoryCounts);
  
        // Calculate results for all (just for the histogram's direct assessment)
        const allcategory = await courseReportModel.getCourseCategoryCounts(courseCode, term);
        const histo = calculateResultsPerCLO(allcategory);
        const [clohisto, indirecthisto, directhisto] = prepareHistogramData(
          learningOutcomes.CLOnumbers,
          totalIndirectPerCLO,
          histo
        );
  
        // Get recommendation if it exists, as well as action plan
        const recommendation = await courseReportModel.getRecommendation(courseCode, term); 
  
        res.render('viewCourseReport', {
          title: 'Course Report', //ayat i added this to render page with title
          courseCode,
          term,
          courseName,
          CLOstatements: learningOutcomes.CLOstatements,
          CLOnumbers: learningOutcomes.CLOnumbers,
          categoryCounts,
          departments,
          resultsPerCLO,
          indirectSums,
          actionPlans,
          totalIndirectPerCLO,
          clohisto,
          directhisto,
          indirecthisto,
          recommendation
        });
      } else {
        res.render('error', { message: 'Course not found' });
      }
    } catch (error) {
      console.error(error);
      res.render('error', { message: 'Internal Server Error' });
    }
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
  
      // Add the CLO number to the array
      clonumbers.push(cloNumber);
    }
  
    return [clonumbers, indirectResults, directResults];
  }

  
  
  
  module.exports = {
    viewCourseReport,
    displayByDepartment
  };