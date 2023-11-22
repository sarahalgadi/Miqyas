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

    // Validate each weight
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            const weightValue = parseInt(weights[i].value);

            // Check if the weight is a valid integer between 0 and 100
            if (isNaN(weightValue) || weightValue < 0 || weightValue > 100 || !Number.isInteger(weightValue)) {
                alert('Invalid weight! Please enter an integer between 0 and 100 for the toggled items.');
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
        alert('Total weight of toggled items must be at least 50%.');
        return;
    }

    // Check if the total weight is not more than 100
    if (totalWeight > 100) {
        alert('Total weight of toggled items cannot exceed 100%.');
        return;
    }

    // If all validations pass, submit the form
    document.forms[0].submit();
}