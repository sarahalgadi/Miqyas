




//course report direct assessment calculation
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


  //course report indirect assessment calculation
  
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

  module.exports={
    calculateOverallSatisfaction,
    calculateResultsPerCLO
  }