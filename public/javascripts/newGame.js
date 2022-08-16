// these refer to the highest index of the array of categories and questions in each category of the game schema
let columns = editColIndex;
let rows = editRowIndex;

function makeQuestion(category, col, row) {
  const qBody = document.createElement("input");
  qBody.type = "text";
  qBody.placeholder = "enter a question";
  qBody.name = `categories[${col}][questions][${row}][body]`;
  qBody.required = true;
  const qAns = document.createElement("input");
  qAns.type = "text";
  qAns.placeholder = "enter the ans";
  qAns.name = `categories[${col}][questions][${row}][answer]`;
  qAns.required = true;
  const qPoints = document.createElement("select");
  for (let i = 1; i < 6; i++) {
    const pointOption = document.createElement("option");
    pointOption.value = i * 200;
    pointOption.innerHTML = `${i * 200}`;
    qPoints.appendChild(pointOption);
  }
  qPoints.name = `categories[${col}][questions][${row}][points]`;
  category.append(qBody);
  category.append(qAns);
  category.append(qPoints);
}

const addColBtn = document.querySelector("#addCategory");
const gamebdy = document.querySelector("#game-body");
addColBtn.addEventListener("click", () => {
  if (columns < 5) {
    const category = document.createElement("div");
    category.className = "category d-flex flex-column";
    category.id = `category-${columns + 1}`;
    const categoryName = document.createElement("input");
    categoryName.type = "text";
    categoryName.placeholder = "enter a category";
    categoryName.name = `categories[${columns + 1}][name]`;
    categoryName.required = true;
    category.appendChild(categoryName);
    for (let i = 0; i < rows + 1; i++) {
      makeQuestion(category, columns + 1, i);
    }
    gamebdy.appendChild(category);
    columns++;
  } else {
    alert("maximum 6 categories a game");
  }
});

const addRowBtn = document.querySelector("#addRow");
addRowBtn.addEventListener("click", () => {
  if (rows < 4) {
    let currentCol = 0;
    const allCategories = document.querySelectorAll(".category");
    allCategories.forEach((category) => {
      makeQuestion(category, currentCol, rows + 1);
      currentCol++;
    });
    rows++;
  } else {
    alert("maximum 5 questions per category");
  }
});

const deleteRowBtn = document.querySelector("#deleteRow");
deleteRowBtn.addEventListener("click", () => {
  if (rows > 0) {
    for (let i = 0; i < columns + 1; i++) {
      const questionBdy = document.querySelector(
        `input[name="categories[${i}][questions][${rows}][body]"]`
      );
      const questionAns = document.querySelector(
        `input[name="categories[${i}][questions][${rows}][answer]"]`
      );
      const questionPoints = document.querySelector(
        `select[name="categories[${i}][questions][${rows}][points]"]`
      );
      questionBdy.remove();
      questionAns.remove();
      questionPoints.remove();
    }
    rows--;
  }
});

const deleteColBtn = document.querySelector("#deleteCategory");
deleteColBtn.addEventListener("click", () => {
  if (columns > 0) {
    document.querySelector(`#category-${columns}`).remove();
    columns--;
  }
});
