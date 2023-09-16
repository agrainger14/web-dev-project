document.addEventListener("DOMContentLoaded", displayThree);

const moodlogButton = document.getElementById('logButton');
const moodlogFormData = document.querySelector('#moodlogForm');
moodlogFormData.addEventListener("submit", submitMood);

moodlogButton.addEventListener("click", () => {
  moodlogFormData.reset();
  displayThree();
});

const textarea = document.getElementById("textCounter");

let slider = document.getElementById('sliderChoice');
let sliderText = document.getElementById('sliderText');
let defaultChoice = document.getElementById("default");

let btnArray = [document.getElementById("b1"), 
                document.getElementById("b2"), 
                document.getElementById("b3"), 
                document.getElementById("b4"), 
                document.getElementById("b5"), 
                document.getElementById("b6")];

let moodArray = [document.getElementById("mood1"), 
                document.getElementById("mood2"), 
                document.getElementById("mood3"),
                document.getElementById("mood4"), 
                document.getElementById("mood5"), 
                document.getElementById("mood6")];
   
slider.oninput = function() {
    switch (parseInt(this.value)) {
      case 1:
        displayOne();
        break;
      case 2:
        displayTwo();
        break;
      case 3:
        displayThree();
        break;
      case 4:
        displayFour();
        break;
      case 5:
        displayFive();
        break;
    }
};
 
function displayOne() {
  sliderText.innerText = displayText[0];
  defaultChoice.value = displayText[0];
  sliderText.style.background = "#DB2237";

  for (let i = 0; i < btnArray.length; i++) {
    btnArray[i].setAttribute("Class", "btn btn-outline-danger");
    btnArray[i].innerHTML = moodsOne[i]
    moodArray[i].value = moodsOne[i];
  }
};

function displayTwo() {
  sliderText.innerText = displayText[1];
  defaultChoice.value = displayText[1];
  sliderText.style.background = "#F97219";

  for (let i = 0; i < btnArray.length; i++) {
    btnArray[i].setAttribute("Class", "btn btn-outline-danger");
    btnArray[i].innerHTML = moodsTwo[i]
    moodArray[i].value = moodsTwo[i];
  }
};

function displayThree() {
  sliderText.innerText = displayText[2];
  defaultChoice.value = displayText[2];
  sliderText.style.background = "#FFC80B";

  for (let i = 0; i < btnArray.length; i++) {
    btnArray[i].setAttribute("Class", "btn btn-outline-warning");
    btnArray[i].innerHTML = moodsThree[i]
    moodArray[i].value = moodsThree[i];
  }
};

function displayFour() {
  sliderText.innerText = displayText[3];
  defaultChoice.value = displayText[3];
  sliderText.style.background = "#B3D500";

  for (let i = 0; i < btnArray.length; i++) {
    btnArray[i].setAttribute("Class", "btn btn-outline-success");
    btnArray[i].innerHTML = moodsFour[i]
    moodArray[i].value = moodsFour[i];
  }
};

function displayFive() {
  sliderText.innerText = displayText[4];
  defaultChoice.value = displayText[4];
  sliderText.style.background = "#68C739";

  for (let i = 0; i < btnArray.length; i++) {
    btnArray[i].setAttribute("Class", "btn btn-outline-success");
    btnArray[i].innerHTML = moodsFive[i]
    moodArray[i].value = moodsFive[i];
  }
};

function submitMood(e) {
  e.preventDefault();

  const formData = new FormData(moodlogFormData);
  const data = Object.fromEntries(formData);

  fetch(`${moodApi}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((res) => {
    if (res.ok) { 
      $('#moodlogSuccess').modal('toggle')
      $('#moodLog').modal('hide')
    } else {
      throw new Error("Error adding mood!")
    }
  }) 
  .catch(error => alert(error));
};

$('#homeButton').on('click', function() {
  $('#moodlogSuccess').modal('hide')
});

$('#moodListButton').on('click', function() {
  $('#moodlogSuccess').modal('hide');
  $('#moodList').modal('toggle');
});

function textareaLengthCheck(e) {
  var textArea = e.value.length;
  var charactersLeft = 255 - textArea;
  textCounter.innerHTML = "Characters left: " + charactersLeft;
};