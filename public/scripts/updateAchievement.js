function updateAchievement(inputElement, questionGrade, studentID, tabIndex) {
       
    const tableRow = inputElement.closest('tr'); 
    const inputValue = parseFloat(inputElement.value);
    const achievementElement = tableRow.querySelector('.achievement'); 
    const saveButton = tableRow.closest('.tab-pane').querySelector('.save-button'); 

    const error = tableRow.closest('.tab-pane').querySelector('.error');


if (isNaN(inputValue) || inputValue < 0 || inputValue > questionGrade) {
    error.innerText = "Grade should be a positive number and less than or equal to the question grade.";        
    saveButton.disabled = true;
    achievementElement.innerText = ""; 
} else {
    // Clear the error message, enable the save button, and update the achievement
    error.innerText = "";       
     saveButton.disabled = false;
    const calculatedAchievement = (inputValue / questionGrade * 100).toFixed(2);
    achievementElement.innerText = calculatedAchievement + "%";
}
}