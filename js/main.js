// Get Questions Number For Each Card
const testCards = document.querySelectorAll(".card");
const testNumSpans = document.querySelectorAll(".num-of-questions");

async function questionsNum() {
  for (let i = 0; i < testCards.length; i++) {
    // testCards[0].classList[1] = html (the second class name in the card element)
    let result = await fetch(`../${testCards[i].classList[1]}_questions.json`);
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
  card.addEventListener("click", (e) => {
    cardsGrid.classList.add("hidden");
    quizBox.classList.remove("hidden");
  }),
);
