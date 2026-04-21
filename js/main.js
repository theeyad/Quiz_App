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

    startQuiz(card.classList[1]);
  }),
);

// Load Quiz
async function startQuiz(topic) {
  let topicName = document.querySelector(".topic-name");
  topicName.innerHTML = topic;

  let result = await fetch(`questions/${topic}_questions.json`);
  let data = await result.json();

  createQuizBody(data);
}

// Make Timer
function createTimer(numOfQuestions, correctAnswers, wrongAnswers) {
  const quizStarted = Date.now();
  const testTime = document.querySelector(".test-time");

  const numOfMinutes = numOfQuestions / 2;
  const minuteInMs = numOfMinutes * 60 * 1000;

  testTime.textContent = `${String(numOfMinutes).padStart(2, "0")}:00`;

  const timerInterval = setInterval(() => {
    let current = Date.now();
    let passed = current - quizStarted;

    const remainingMs = minuteInMs - passed;

    // 1. Check if time is up!
    if (remainingMs <= 0) {
      clearInterval(timerInterval);
      testTime.textContent = "00:00";
      showResult(correctAnswers, wrongAnswers, numOfQuestions);
      return;
    }

    const totalSecondsLeft = Math.ceil(remainingMs / 1000);

    const minutes = Math.floor(totalSecondsLeft / 60);
    const seconds = totalSecondsLeft % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    testTime.textContent = `${formattedMinutes}:${formattedSeconds}`;

    console.log(passed)

    if (passed >= minuteInMs) {
      console.log("done");
      clearInterval(timerInterval);
      showResult(correctAnswers, wrongAnswers, numOfQuestions);
      return;
    }
  }, 1000);
}

// Create Question and Chices
function createQuizBody(data) {
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let currentQuestion = 0;

  createTimer(data.length, correctAnswers, wrongAnswers);

  let question = document.querySelector(".question");
  question.innerHTML = "";
  question.append(document.createTextNode(data[currentQuestion].question));

  let answers = document.querySelectorAll(".answers .answer");
  answers.forEach((answer, key) => {
    answer.innerHTML = "";
    answer.append(document.createTextNode(data[currentQuestion].choices[key]));
  });

  answerListeners(answers);

  document.querySelector(".submit").addEventListener("click", () => {
    if (document.querySelector(".answers .answer.active")) {
      if (
        document.querySelector(".answers .answer.active").textContent ===
        data[currentQuestion].answer
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

    if (data[currentQuestion] === undefined) {
      showResult(correctAnswers, wrongAnswers, data.length);
      return;
    }

    let question = document.querySelector(".question");
    question.innerHTML = "";
    question.append(document.createTextNode(data[currentQuestion].question));

    answers.forEach((answer, key) => {
      answer.innerHTML = "";
      answer.append(
        document.createTextNode(data[currentQuestion].choices[key]),
      );
    });
  });
}

// Add Event Listeners to Each answer
function answerListeners(answers) {
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
}

// Show Quiz Result
function showResult(correctAnswers, wrongAnswers, numOfQuestions) {
  quizBox.classList.add("hidden");
  const resultBox = document.querySelector(".result-box");

  resultBox.classList.remove("hidden");

  const score = document.querySelector(".final-result .score");
  const numberOfQuestions = document.querySelector(
    ".final-result .number-of-questions",
  );

  const trueAnswers = document.querySelector(".right-answers");
  const falseAnswers = document.querySelector(".wrong-answers");

  const back = document.querySelector(".back");

  score.innerHTML = correctAnswers;
  numberOfQuestions.innerHTML = numOfQuestions;

  trueAnswers.innerHTML = correctAnswers;
  falseAnswers.innerHTML = wrongAnswers;

  back.addEventListener("click", () => {
    resultBox.classList.add("hidden");
    cardsGrid.classList.remove("hidden");
  });
}
