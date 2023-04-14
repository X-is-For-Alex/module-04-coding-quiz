// listen for clicks anywhere in main element
let main = document.querySelector("main");

// global variables
let questionIndex = 0;
let list = document.querySelector("#answerList");
let score = 0;
let timerStart = 0;
let QnA = [
  ["QUESTION0", "answer0A", "answer0B", "answer0C", "answer0D"],
  ["QUESTION1", "answer1A", "answer1B", "answer1C", "answer1D"],
  ["QUESTION2", "answer2A", "answer2B", "answer2C", "answer2D"],
  ["QUESTION3", "answer3A", "answer3B", "answer3C", "answer3D"],
  ["QUESTION4", "answer4A", "answer4B", "answer4C", "answer4D"],
  ["QUESTION5", "answer5A", "answer5B"],
  ["QUESTION6", "answer6A", "answer6B"],
  ["QUESTION7", "answer7A", "answer7B"],
  ["QUESTION8", "answer8A", "answer8B"],
  ["QUESTION9", "answer9A", "answer9B"],
];


// on main element click > find child element
main.addEventListener("click", function (event) {
  let clickedElement = event.target;
  let clickedValue = clickedElement.textContent;

  // listen for start button click
  if (clickedElement.matches("button")) {
    questionIndex = 0;  // reset question counter so game can start over
    eraseAnswers();
    startQuiz();
  }

  // listen for answer click
  else if (clickedElement.matches(".answers")) {

    let trueOrFalse = checkAnswer(clickedValue);
    scoreCounter(trueOrFalse);

    questionIndex++;  // update question counter from current question in QnA to the next line
    eraseAnswers();
    if (questionIndex < QnA.length) {
      writeQuestion();
    }
    else {
      document.getElementById("questionField").textContent = "";  // erase question field
      endGame();
    }
    scoreCounter()
  }
})

// run this function on page load
function init() {
  // get highscore and name from localStorage
  // write highscore and name to page
  document.querySelector("#maxScore").textContent = QnA.length;
  document.querySelector("#currentScore").textContent = score;
  
  document.querySelector("#localName").textContent = localStorage.getItem("name");
  document.querySelector("#localScore").textContent = localStorage.getItem("score");
}

function startQuiz() {
  score = 0;
  scoreCounter();
  timerStart = 60;
  timer();
  QnA = randomizeQuestions();
  writeQuestion();
}

// generates a randomized array from QnA array
function randomizeQuestions() {
  let array = QnA.slice();  // create a copy of global array so we don't mutate the original
  let shuffledList = randomNumberGenerator(array)
  return shuffledList;
}

// write the current question (based on questionIndex value) to page
function writeQuestion() {
  document.querySelector("#questionField").textContent = QnA[questionIndex][0];
  writeAnswers();
}

// randomize and write answers to current question (based on questionIndex value) to page
function writeAnswers() {
  let answers = randomizeAnswers()

  for (j = 0; j < answers.length; j++) {
    let li = document.createElement("li");
    li.setAttribute("id", ("answer" + j));
    li.setAttribute("class", "answers");
    li.textContent = answers[j];
    list.appendChild(li);
  }
}

// generate random index values to be used for random question/answer order
function randomNumberGenerator(limit) {
  let randomItems = limit.sort(() => Math.random() - 0.5)
  return randomItems;
}

// isolate index 0 (question) from index 1+ (answers) in QnA
function randomizeAnswers() {
  let orderedAnswers = [...QnA[questionIndex]];  // create a copy of global array so we don't mutate the original
  onlyAnswers = orderedAnswers.shift();

  let shuffledAnswers = randomNumberGenerator(orderedAnswers)
  return shuffledAnswers;
}

// erase answers from webpage
function eraseAnswers() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

// compare user-selected answer with correct answer (will always be QnA[questionIndex][1])
function checkAnswer(selectedAnswer) {
  let actualAnswer = QnA[questionIndex][1]

  if (selectedAnswer === actualAnswer) {
    console.log("correct")
    // timerStart = timerStart + 10;
    return true;
  }
  else {
    console.log("INcorrect")
    timerStart = timerStart - 10;
    return false;
  }
}

function scoreCounter(trueOrFalse) {
  document.querySelector("#maxScore").textContent = QnA.length;
  document.querySelector("#currentScore").textContent = score;

  if (trueOrFalse) {
    score++;
    document.querySelector("#currentScore").textContent = score;
  }
}

function timer() {
  let timeLeft = setInterval(function () {
    timerStart--;
    document.querySelector("#countdown").textContent = timerStart + " seconds left";

    if (timerStart <= 0) {
      // Stops execution of action at set interval
      clearInterval(timeLeft);
      console.log("ran out of time")
      document.getElementById("questionField").textContent = "";  // erase question field
      eraseAnswers();
      endGame();
    }
  }, 1000);
}

function endGame() {
  let saveScore = confirm("Would you like to save your score?")
  console.log(saveScore);

  if(saveScore) {
    let name = prompt("Please enter your name or initials!")
    localStorage.setItem("name", name)
    localStorage.setItem("score", score)
  }
  else {
    return
  }
  init()
}

init();