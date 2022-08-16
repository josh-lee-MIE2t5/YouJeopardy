const highestColInd = colIndex;
const highestRowInd = rowIndex;
let team1Points = 0;
let team2Points = 0;
//makes the point adding and subtracting buttons work
function changeScore(team, oper) {
  document
    .querySelector(`#team${team}-${oper}`)
    .addEventListener("click", () => {
      if (oper === "add" && team === 1) {
        team1Points += 200;
      } else if (oper === "sub" && team === 1) {
        team1Points -= 200;
      } else if (oper === "add" && team === 2) {
        team2Points += 200;
      } else if (oper === "sub" && team === 2) {
        team2Points -= 200;
      }
      if (team === 1) {
        document.querySelector(
          `#team${team}-points`
        ).innerHTML = `Points ${team1Points}`;
      } else if (team === 2) {
        document.querySelector(
          `#team${team}-points`
        ).innerHTML = `Points ${team2Points}`;
      }
    });
}
changeScore(1, "add");
changeScore(2, "add");
changeScore(1, "sub");
changeScore(2, "sub");

//makes the showing and hiding of each question and answer
for (let i = 0; i < colIndex; i++) {
  for (let j = 0; j < rowIndex; j++) {
    const btnForQuestion = document.querySelector(
      `#category-${i}-question-${j}`
    );
    btnForQuestion.addEventListener("click", function () {
      document.querySelectorAll(".qBody").forEach((span) => {
        span.hidden = true;
      });
      document.querySelectorAll(".qAnsBtn").forEach((btn) => {
        btn.hidden = true;
      });
      document.querySelectorAll(".qAns").forEach((span) => {
        span.hidden = true;
      });
      const questionToShow = document.querySelector(
        `#category-${i}-qBody-${j}`
      );
      questionToShow.hidden = false;
      const showAnswerBtn = document.querySelector(
        `#category-${i}-ansBtn-${j}`
      );
      showAnswerBtn.hidden = false;
      showAnswerBtn.addEventListener("click", function () {
        const qAnswer = document.querySelector(`#category-${i}-answer-${j}`);
        qAnswer.hidden = false;
        this.disabled = true;
      });
      this.disabled = true;
    });
  }
}
