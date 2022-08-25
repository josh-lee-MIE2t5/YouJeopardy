function generateMoreGames(game) {
  let template = ` <div
    class="card text-white mb-3 mx-auto game-box"
    style="max-width: 22rem"
    >
    <div class="card-header">Made by: ${game.author.username}</div>
    <div class="card-body">
      <h5 class="card-title">${game.title}</h5>
      <p class="card-text">
        <a href="/game/${game._id}" class="btn btn-warning"
          >See Details</a
        >
      </p>
    </div>
    </div> `;
  return template;
}

document
  .querySelector("#filter-paginate-btn")
  .addEventListener("click", function (e) {
    e.preventDefault();
    fetch(this.href)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        for (let game of data.docs) {
          let template = generateMoreGames(game);
          $("#games-container").append(template);
        }
        if (!data.hasNextPg) {
          document.querySelector("#games-list").removeChild(this);
        } else {
          let nextQuery = this.href;
          nextQuery.replace(`page=${data.page}`, `page=${data.page + 1}`);
        }
      })
      .catch((err) => console.log(err));
  });
