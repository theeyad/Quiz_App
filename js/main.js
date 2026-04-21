// Global Vars
let jsonData = [];
let quizTimer;
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

const answers = document.querySelectorAll(".answers .answer");
const resultBox = document.querySelector(".result-box");

// Set Questions Number For Each Card
const testCards = document.querySelectorAll(".card");
const testNumSpans = document.querySelectorAll(".num-of-questions");

async function questionsNum() {
  for (let i = 0; i < testCards.length; i++) {
    // testCards[0].classList[1] = html (the second class name in the card element)
    let result = await fetch(
      `questions/${testCards[i].classList[1]}_questions.json`,
    );
    let data = await result.json();

    // assign number of questions in the json file to the span
    testNumSpans[i].innerHTML = data.length;
  }
}

questionsNum();

// Choose Quiz
const cardsGrid = document.querySelector(".cards");
const quizBox = document.querySelector(".test-box");

testCards.forEach((card) =>
  card.addEventListener("click", () => {
    cardsGrid.classList.add("hidden");
    quizBox.classList.remove("hidden");

    // Name of the Topic
    startQuiz(card.classList[1]);
  }),
);

// Load Quiz
async function startQuiz(topic) {
  // resetting everything
  correctAnswers = 0;
  wrongAnswers = 0;
  currentQuestion = 0;

  let topicName = document.querySelector(".topic-name");
  topicName.innerHTML = topic;

  let result = await fetch(`questions/${topic}_questions.json`);
  let data = await result.json();
  jsonData = data;

  createTimer();
}

// Make Timer
function createTimer() {
  const quizStarted = Date.now();
  const testTime = document.querySelector(".test-time");

  const numOfMinutes = 0.5;
  const minuteInMs = numOfMinutes * 60 * 1000;

  testTime.textContent = `${String(numOfMinutes).padStart(2, "0")}:00`;

  quizTimer = setInterval(() => {
    let current = Date.now();
    let passed = current - quizStarted;

    const remainingMs = minuteInMs - passed;

    if (remainingMs <= 0) {
      clearInterval(quizTimer);
      testTime.textContent = "00:00";
      showResult(correctAnswers, wrongAnswers, jsonData.length);
      return;
    }

    const totalSecondsLeft = Math.ceil(remainingMs / 1000);

    const minutes = Math.floor(totalSecondsLeft / 60);
    const seconds = totalSecondsLeft % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    testTime.textContent = `${formattedMinutes}:${formattedSeconds}`;
  }, 1000);

  createQuizBody();
}

// Create Question and Chices
function createQuizBody() {
  let question = document.querySelector(".question");
  question.textContent = `${jsonData[currentQuestion].question}`;

  answers.forEach((answer, key) => {
    answer.textContent = `${jsonData[currentQuestion].choices[key]}`;
  });
}

// Show Quiz Result
function showResult(correctAnswers, wrongAnswers, numOfQuestions) {
  quizBox.classList.add("hidden");

  resultBox.classList.remove("hidden");

  const score = document.querySelector(".final-result .score");
  const numberOfQuestions = document.querySelector(
    ".final-result .number-of-questions",
  );

  const trueAnswers = document.querySelector(".right-answers");
  const falseAnswers = document.querySelector(".wrong-answers");

  score.innerHTML = correctAnswers;
  numberOfQuestions.innerHTML = numOfQuestions;

  trueAnswers.innerHTML = correctAnswers;
  falseAnswers.innerHTML = wrongAnswers;
}

// Event Listeners
answers.forEach((answer) => {
  answer.addEventListener("click", () => {
    if (document.querySelector(".answers .answer.active")) {
      document
        .querySelector(".answers .answer.active")
        .classList.add("border-slate-200");
      document
        .querySelector(".answers .answer.active")
        .classList.remove("active", "bg-indigo-50", "border-indigo-300");
    }

    answer.classList.add("active", "bg-indigo-50", "border-indigo-300");
    answer.classList.remove("border-slate-200");
  });
});

document.querySelector(".submit").addEventListener("click", () => {
  if (document.querySelector(".answers .answer.active")) {
    if (
      document.querySelector(".answers .answer.active").textContent ===
      jsonData[currentQuestion].answer
    ) {
      correctAnswers++;
    } else {
      wrongAnswers++;
    }

    document
      .querySelector(".answers .answer.active")
      .classList.add("border-slate-200");
    document
      .querySelector(".answers .answer.active")
      .classList.remove("active", "bg-indigo-50", "border-indigo-300");
  } else {
    wrongAnswers++;
  }

  currentQuestion++;

  if (jsonData[currentQuestion] === undefined) {
    clearInterval(quizTimer);
    showResult(correctAnswers, wrongAnswers, jsonData.length);
    return;
  }

  let question = document.querySelector(".question");
  question.textContent = `${jsonData[currentQuestion].question}`;

  answers.forEach((answer, key) => {
    answer.textContent = `${jsonData[currentQuestion].choices[key]}`;
  });
});

const back = document.querySelector(".back");
back.addEventListener("click", () => {
  resultBox.classList.add("hidden");
  cardsGrid.classList.remove("hidden");
});
