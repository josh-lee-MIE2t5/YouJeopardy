const paginatePublic = document.getElementById("paginate");
paginatePublic.addEventListener("click", function (e) {
  e.preventDefault();
  fetch(this.href)
    .then((response) => response.json())
    .then((data) => {
      for (let game of data.docs) {
        let template = generateMoreGames(game);
        $("#games-container").append(template);
      }
      if (data.hasNextPage) {
        let { nextPage, page } = data;
        const currentQuery = `?page=${page}`;
        let newHref = this.href.replace(currentQuery, `?page=${nextPage}`);
        this.href = newHref;
      } else {
        document.getElementById("games-list").removeChild(this);
      }
    })
    .catch((err) => console.log(err));
});

function generateMoreGames(game) {
  let header = `Made by: ${game.author.username}`;
  if (window.location.href.indexOf("/myGames") !== -1)
    header = `${game.access}`;
  let template = ` <div
    class="card text-white mb-3 mx-auto game-box"
    style="max-width: 22rem"
    >
    <div class="card-header">${header}</div>
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
