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

    const modalContainer = document.getElementById('modal-container');

    const closeModal = document.getElementById('close');

    closeModal.addEventListener('click', () => {
      modalContainer.classList.remove('show');
      document.body.classList.remove('modal-open');
    })

    //Handles invalid or null inputs
    if (!courseCode || isNaN(unit) || !grade) {
      // alert('Please fill out all fields correctly.');
      modalContainer.classList.add('show');
      document.body.classList.add('modal-open');
      return;
    }

    courses.push({
      courseCode,
      unit,
      grade
    });

    //Saves the course in local storage
    localStorage.setItem('course', JSON.stringify(courses));
    renderCoursesHtml();

    courseCodeInputElement.value = '';
    unitInputElement.value = '';
    gradeInputElement.value = '';
});

//Maps grades to respective points, gets grade points and calculates cgpa
function calculateCgpa() {
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

  let cgpa = totalGradePoints / totalUnits;

  if(totalUnits === 0) {
    document.querySelector('.js-result-display').innerHTML = `
      No courses to calculate.
    `;
  } else {
    document.querySelector('.js-result-display').innerHTML = `
    CGPA: ${cgpa.toFixed(2)}<br>
    Carry Overs: ${carryOvers}
  `;
  }

}

//This displays the courses entered on the webpage
function renderCoursesHtml() {
  let coursesHtml = '';
  courses.forEach((coursesObject, index) => {
    const {courseCode, unit, grade} = coursesObject;
    const html = `
      <div class="course-row">
        <div class="course-code">${courseCode}</div>
        <div class="course-unit">${unit}</div>
        <div class="grade">${grade}</div>
        <button class="delete-button js-delete-button">Delete</button>
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

//Calculates the CGPA when the calculate cgpa button is clicked.
document.querySelector('.js-calculate-button')
  .addEventListener('click', () => {
    calculateCgpa();
});
