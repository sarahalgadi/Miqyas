
  //----------------------------------------------------------------------------------------------------------
  // Get all the checkbox and dropdown list elements
  const coordinatorCheckboxes = document.querySelectorAll('[name="username"]');
  const courseDropdowns = document.querySelectorAll('[name="course"]');
  const submitButton = document.getElementById("saveRoles");

  // Loop through each checkbox and add event listeners
  coordinatorCheckboxes.forEach(function (checkbox, index) {
    const courseDropdown = courseDropdowns[index];
    const defaultOption = courseDropdown.value;

    // Add an event listener to the checkbox
    checkbox.addEventListener('change', function () {
      // Check if the checkbox is checked
      if (checkbox.checked) {
        // Enable the corresponding dropdown list
        courseDropdown.disabled = false;
        if (!courseDropdown.value) {
          document.getElementById("errorText").innerText = "Choose a course!";
          submitButton.disabled = true;
        } else {
          document.getElementById("errorText").innerText = "";
          submitButton.disabled = false;
        }
      } else {
        courseDropdown.disabled = true;
        courseDropdown.value = defaultOption;
        submitButton.disabled = true;
      }
    });

    // Add an event listener to the dropdown
    courseDropdown.addEventListener('change', function () {
      if (courseDropdown.value) {
        submitButton.disabled = false;
        document.getElementById("errorText").innerText = "";
      } else {
        submitButton.disabled = true;
        document.getElementById("errorText").innerText = "Choose a course!";
      }
    });
  });


  //---------------------------------------------------------------------------------------------------------
  //to ensure a course is only selected once
  function handleCourseChange(event) {
    const select = event.target;
    const selectedCourse = select.value;
    const otherSelects = document.querySelectorAll('select[name="course"]:not([value=""])');

    for (let i = 0; i < otherSelects.length; i++) {
      const otherSelect = otherSelects[i];

      if (otherSelect !== select && otherSelect.value === selectedCourse) {
        otherSelect.value = ""; // Reset the other select if the same course is selected
      }
    }
  }

  const courseSelects = document.querySelectorAll('select[name="course"]');
  for (let i = 0; i < courseSelects.length; i++) {
    const select = courseSelects[i];
    select.addEventListener('change', handleCourseChange);
  }