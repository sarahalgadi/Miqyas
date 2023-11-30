//defining count to track number of clos added
let cloCount = 1;

//dynamically adds a clo to the table of clos when the "add clo" button is clicked
function addCLO(event) {
    event.preventDefault();
    //allows adding a clo if clocount is less than 8
    if (cloCount < 8) {
        cloCount++;
        const table = document.getElementById('cloTable');
        //inserting a new row for the new clo then adding the html for the added cell
        const row = table.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        cell1.innerHTML = `<input type="number" name="cloNumber" class="form-control" value="${cloCount}" readonly style="border: none;">`;
        cell2.innerHTML = `<select name="domain" class="form-select" id="typeSelect">
                                    <option value="" selected disabled>Type</option>
                                    <option value="Knowledge">Knowledge</option>
                                    <option value="Values">Values</option>
                                    <option value="Skills">Skills</option>
                                </select> `;
        cell3.innerHTML = '<textarea rows="1" name="description" class="form-control" required></textarea>';
        cell4.innerHTML = '<button class="btn" style="background-color: #15416e;" onclick="deleteCLO(this)"><i class="fas fa-times" style="color: white"></i></button>';
        //once 8 clos are reached, the "add clo" button is disabled to prevent adding more
        if (cloCount === 8) {
            document.getElementById('addCLOButton').style.backgroundColor = 'lightgrey';
            document.getElementById('addCLOButton').disabled = true;
        }
        //double validation that number of clos does not exceed 8 if somehow the button was not disabled
    } else if (cloCount === 8) {
        const validationMessage = document.getElementById('validationMessage');
        validationMessage.textContent = 'You can add a maximum of 8 CLOs only.';
        validationMessage.style.color = '#15416e';
    }
    //if error message is shown to the user for attempting to save <4 clos and the user adds enough clos, the error message disappears
    if (cloCount >= 4) {
        const validationMessage = document.getElementById('validationMessage');
        validationMessage.textContent = ''; // Clear the validation message
    }
}

//handles deletion of clo
function deleteCLO(row) {
    const table = document.getElementById('cloTable');
    const rowIndex = row.parentNode.parentNode.rowIndex;
    table.deleteRow(rowIndex);
    cloCount--;
    //calls update function to update the numbering and enable add button
    updateCLONumbers();
}

function updateCLONumbers() {
    const table = document.getElementById('cloTable');
    const rows = table.getElementsByTagName('tr');
    //updates the numbering of rows to accomodate changes
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        cells[0].innerHTML = `<input type="number" class="form-control" name= "cloNumber" value="${i}" readonly style="border: none;">`;
    }
    //removes disabled button
    if (cloCount < 8) {
        document.getElementById('addCLOButton').style.backgroundColor = '';
        document.getElementById('addCLOButton').disabled = false;
        const validationMessage = document.getElementById('validationMessage');
        validationMessage.textContent = '';
    }
}


function saveCLOs(event) {
    event.preventDefault();
    //prevents saving unless we have a minimmum of 4 clos
    if (cloCount < 4) {
        const validationMessage = document.getElementById('validationMessage');
        validationMessage.textContent = 'Please add at least four CLOs.';
        validationMessage.style.color = 'Maroon';
        validationMessage.style.fontWeight = '500';
        return false;
    } else {
        const validationMessage = document.getElementById('validationMessage');
        validationMessage.textContent = '';
        const addCLOForm = document.getElementById('addCLOForm');
        addCLOForm.submit();    }
}