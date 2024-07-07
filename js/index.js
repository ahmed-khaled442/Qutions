// https://opentdb.com/api.php?amount=10&category=25&difficulty=medium

let form = document.querySelector("#quizOptions");
console.log(form);
let categoryMenu = document.querySelector("#categoryMenu");
console.log(categoryMenu);
let difficultyOptions = document.querySelector("#difficultyOptions");
console.log(difficultyOptions);
let numberQUTION = document.querySelector("#questionsNumber");
console.log(numberQUTION);
let startQuiz = document.querySelector("#startQuiz");
console.log(startQuiz);
let questions;
let api;

let questROW = document.getElementById("questROW");
console.log(questROW);

startQuiz.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let Number = numberQUTION.value;

  api = new Quiz(category, difficulty, Number);
  questions = await api.getAllqution();
  console.log(questions);
  form.classList.replace("d-flex", "d-none");

  let myQution = new Question(0);
  console.log(myQution);
  myQution.display();
});

class Quiz {
  constructor(category, difficulty, Number) {
    this.category = category;
    this.difficulty = difficulty;
    this.Number = Number;
    this.socre = 0;
  }
  getApi() {
    return `https://opentdb.com/api.php?amount=${this.Number}&category=${this.category}&difficulty=${this.difficulty}`;
  }

  async getAllqution() {
    let result = await fetch(this.getApi());
    let data = await result.json();
    return data.results;
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.question = questions[index].question;
    this.category = questions[index].category;
    this.difficulty = questions[index].difficulty;
    this.coorectanswer = questions[index].correct_answer;
    this.incorrect = questions[index].incorrect_answers;
    this.myAllanser = this.getAllquestion();
    this.isAnsewrs = false;
  }
  getAllquestion() {
    let allAnserws = [...this.incorrect, this.coorectanswer];
    allAnserws.sort();
    return allAnserws;
  }

  display() {
    const box = `
      <div
        class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
      >
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category">${this.category}</span>
          <span class="fs-6 btn btn-questions">${this.index + 1} of${
      questions.length
    } Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
      ${this.myAllanser
        .map((anser) => `<li> ${anser}</li>`)
        .toString()
        .replaceAll(",", "")} 
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${
          api.socre
        } </h2>        
      </div>
    `;
    questROW.innerHTML = box;

    let allchoicess = document.querySelectorAll(".choices li");
    allchoicess.forEach((li) => {
      li.addEventListener("click", () => {
        console.log(this.coorectanswer);
        this.checkanserw(li);
        this.nextquestion();
      });
    });
  }

  checkanserw(choies) {
    if (!this.isAnsewrs) {
      this.isAnsewrs = true;
      if (choies.innerText == this.coorectanswer) {
        choies.classList.add("correct", "animate__animated", "animate__pulse");
        api.socre++;
      } else {
        choies.classList.add("wrong", "animate__animated", "animate__shakeX");
      }
    }
  }

  nextquestion() {
    this.index++;

    setTimeout(() => {
      if (this.index < questions.length) {
        let nextquestion = new Question(this.index);
        console.log(nextquestion);
        nextquestion.display();
      } else {
        questROW.innerHTML = this.showResult();
        document
          .querySelector(".question .again")
          .addEventListener("click", function () {
            window.location.reload();
          });
        console.log();
      }
    }, 1000);
  }
  showResult() {
    return `
      <div
        class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
      >
        <h2 class="mb-0">
        ${
          api.socre == questions.length
            ? `Congratulations you anser all question coreect 🎉`
            : `Your score is ${api.socre}`
        }      
        </h2>
        <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `;
  }
}
