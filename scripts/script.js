const courses = JSON.parse(localStorage.getItem('course')) || [];

renderCoursesHtml();

//This get's the course information from the user when the add button is clicked.
document.querySelector('.js-add-button')
  .addEventListener('click', () => {
    const courseCodeInputElement = document.querySelector('.js-course-code-input');
    const courseCode = courseCodeInputElement.value;
    
    const unitInputElement = document.querySelector('.js-unit-input');
    const unit = Number(unitInputElement.value);
    
    const gradeInputElement = document.querySelector('.js-grade-input');
    const grade = gradeInputElement.value;
    
    //Handles invalid or null inputs
    if (!courseCode || isNaN(unit) || !grade) {
      statusMessage('Please fill out all the fields!', 'error');
      return;
    } else {
      statusMessage('Course Added successfully!', 'success');
      courses.push({
        courseCode,unit,grade
      });
    }

    //Saves the course in local storage
    localStorage.setItem('course', JSON.stringify(courses));
    renderCoursesHtml();

    courseCodeInputElement.value = '';
    unitInputElement.value = '';
    gradeInputElement.value = '';
});

//Maps grades to respective points, gets grade points and calculates cgpa
function calculateGpa() {
  const resultElement = document.querySelector('.js-result-display');
  let totalGradePoints = 0;
  let totalUnits = 0;
  let carryOvers = 0;

  const gradeScale = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
    F: 0
  };

  const gradePoints = courses.map(course => gradeScale[course.grade]);

  courses.forEach((course, index) => {
    totalGradePoints += gradePoints[index] * course.unit;
    totalUnits += course.unit;

    if(gradePoints[index] === 0) {
      carryOvers++;
      return;
    }

  });

  let gpa = totalGradePoints / totalUnits;

  if(totalUnits === 0) {
    resultElement.innerHTML = `
    <strong>No course added yet.</strong>
    <p class="italic-text">Add at least one course to calculate your GPA.</p>
    `;
    
    setTimeout(() => {
      resultElement.textContent = '';
    }, 2000);
  } else {
    resultElement.innerHTML = `
    <strong>GPA: ${gpa.toFixed(2)}</strong>
    <p>Carry Overs: ${carryOvers}</p>
  `;
  }
}

//This displays the courses entered on the webpage
function renderCoursesHtml() {
  let coursesHtml = '';
  courses.forEach((coursesObject, index) => {
    const {courseCode, unit, grade} = coursesObject;
    const html = `
      <div class="course">
        <div class="index">
          ${index + 1}.
        </div>
        
        <div class="course-row">
          <div class="course-code">${courseCode}</div>
          <div class="course-unit">${unit}</div>
          <div class="grade">${grade}</div>
          <img src="icons/delete-icon.svg" class="delete-button js-delete-button">
        </div>
      </div>
    `;
    coursesHtml += html;
  })

  document.querySelector('.js-course-list-grid').innerHTML = coursesHtml;

  document.querySelectorAll('.js-delete-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        courses.splice(index, 1);
        
        localStorage.setItem('course', JSON.stringify(courses));
        renderCoursesHtml();
      });
    });
}

const statusMessage = (text, type) => {
  const messageElement = document.querySelector('.js-message');
  
  messageElement.textContent = text;
  messageElement.className = `status-message js-message ${type}`;
  
  setTimeout(() => {
    messageElement.textContent = '';
  }, 2000);
};

//Calculates the CGPA when the calculate cgpa button is clicked.
document.querySelector('.js-calculate-button')
  .addEventListener('click', () => {
    calculateGpa();
});
