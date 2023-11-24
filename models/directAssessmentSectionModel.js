const pool = require('../database');


//probably need to restructure the models :) 

//this already exists in dccModel 
//get the assessment type
async function getAssessmentType (courseCode, semester){
  const [rows, fields] = await pool.execute
  ('SELECT type FROM direct_assessment WHERE courseCode=? AND semester=?');
  return rows;
}

//get the clos of the course (for the mapping dropdownlist)
//do we need the statement of the CLO?????????
async function getCLO (courseCode, semester){
  const [rows, fields] = await pool.execute
  ('SELECT CLONumber FROM course_learning_outcomes WHERE courseCode=? AND semester=?');
  return rows;
}

//insert assessment dets
async function addAssessmentDetails(courseCode,semester,type, sectionNumber){
  const [rows, fields] = await pool.execute
  ('INSERT INTO assessment_details (courseCode, assessmentNumber, statment, grade, CLONumber, semester, type, sectionNumber) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE statment, grade, CLONumber = VALUES(statment, grade, CLONumber)');
  return rows;
  //I dont know what to return if i am inserting into the databse
}

//get assessment details
async function getAssessmentDetails (courseCode, semester,sectionNumber,type){
  const [rows, fields] = await pool.execute
  ('SELECT assessmentNumber, statment, grade FROM assessment_details WHERE courseCode=? AND semester=? AND sectionNumber=? AND type=?');
  return rows;
}

//deleting assessment detials
//this does not work CHANGE IT!!!!!!!
/*
async function getAssessmentDetails (courseCode, semester,sectionNumber,type){
  const [rows, fields] = await pool.execute
  ('DELETE FROM assessment_details WHERE courseCode=? AND semester=? AND sectionNumber=? AND type=?');
  return rows;
}*/



//updating assessment Description
/*async function updateAssessmentDescription (courseCode,semester,sectionNumber,type,assesmentNumber){
  const [rows, fields] = await pool.execute
  ('UPDATE assessment_details SET statment = ? WHERE coursecode = ? AND semester = ? AND sectionNumber=? AND type=?, assesmentNumber=?');
  return rows;
  //I dont know what to return if i am inserting into the databse
}*/

//updating assessment weight
/*async function updateAssessmentWeight (courseCode,semester,sectionNumber,type,assesmentNumber){
  const [rows, fields] = await pool.execute
  ('UPDATE assessment_details SET weight = ? WHERE coursecode = ? AND semester = ? AND sectionNumber=? AND type=?, assesmentNumber=?');
  return rows;
  //I dont know what to return if i am inserting into the databse
}*/

//updating assessment CLO mapping
/*
async function updateAssessmentCLO (courseCode,semester,sectionNumber,type,assesmentNumber){
  const [rows, fields] = await pool.execute
  ('UPDATE assessment_details SET CLONumber = ? WHERE coursecode = ? AND semester = ? AND sectionNumber=? AND type=?, assesmentNumber=?');
  return rows;
  //I dont know what to return if i am inserting into the databse
}*/ 

module.exports ={getAssessmentType, addAssessmentDetails, getAssessmentDetails,getCLO};
