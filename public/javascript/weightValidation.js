//Javascript for cc.ejs

function toggleWeightInput(weightInputId) {
    var checkbox = document.getElementById(weightInputId);
    checkbox.classList.toggle('d-none', !checkbox.classList.contains('d-none'));
}

function validateWeights() {
    // Get the checkboxes and their corresponding weight inputs
    const checkboxes = [
        document.getElementById('projectCheckbox'),
        document.getElementById('majorCheckbox'),
        document.getElementById('assignmentCheckbox'),
        document.getElementById('quizCheckbox'),
        document.getElementById('finalExamCheckbox'),
        document.getElementById('otherCheckbox')
    ];

    const weights = [
        document.getElementById('projectWeight'),
        document.getElementById('majorWeight'),
        document.getElementById('assignmentWeight'),
        document.getElementById('quizWeight'),
        document.getElementById('finalExamWeight'),
        document.getElementById('otherWeight')
    ];

    // Get the error text element
    const errorText = document.getElementById('errorText');
    // Get the save button element
    const saveButton = document.getElementById('saveButton');

    // Clear previous error messages
    errorText.innerText = '';


    // Validate each weight
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            const weightValue = parseInt(weights[i].value);

            // Check if the weight is a valid integer between 0 and 100
            if (isNaN(weightValue) || weightValue < 0 || weightValue > 100 || !Number.isInteger(weightValue)) {
                errorText.innerText = 'Invalid weight! Please enter an integer between 0 and 100.';
                saveButton.disabled = true; // Disable the button
                return;
            }
        }
    }

    // Calculate the total weight of toggled items
    let totalWeight = 0;

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            totalWeight += parseInt(weights[i].value);
        }
    }

    // Check if the total weight is at least 50%
    if (totalWeight < 50) {
        errorText.innerText = 'Total weight must be at least 50%.';
        saveButton.disabled = true; // Disable the button
        return;
    }

    // Check if the total weight is not more than 100
    if (totalWeight > 100) {
        errorText.innerText = 'Total weight cannot exceed 100%.';
        saveButton.disabled = true; // Disable the button
        return;
    }

    // If all validations pass, enable the save button and submit the form
    saveButton.disabled = false;
}
// Function to handle input changes after failing in validating the weights
function handleInputChange() {
    // Clear error messages and re-enable the save button on input change
    const errorText = document.getElementById('errorText');
    const saveButton = document.getElementById('saveButton');

    errorText.innerText = '';
    saveButton.disabled = false;

    // Validate weights again
    validateWeights();
}

// Attach handleInputChange to input elements
const weightInputs = document.querySelectorAll('input[type="number"]');
weightInputs.forEach(input => {
    input.addEventListener('input', handleInputChange);
});