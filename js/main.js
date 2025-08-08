const searchInput = document.querySelector("#searchInput");
const clearBtn = document.querySelector("#clearBtn");
const moviesContainer = document.querySelector(".movies");

const movieApi = new MovieAPI();
let currentPage = 1;

runEventListener();

function runEventListener() {
    document.addEventListener("DOMContentLoaded", () => {
        getMoviesFromAPI(currentPage);
    });

    searchInput.addEventListener("input", () => getFilm(1));

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearBtn.style.display = "none";
        searchInput.focus();
        currentPage = 1;
        getMoviesFromAPI(currentPage);
    });

    document.querySelector("#prevBtn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            isSearching() ? getFilm(currentPage) : getMoviesFromAPI(currentPage);
        }
    });

    document.querySelector("#nextBtn").addEventListener("click", () => {
        currentPage++;
        isSearching() ? getFilm(currentPage) : getMoviesFromAPI(currentPage);
    });
}

function isSearching() {
    return searchInput.value.trim() !== "";
}

async function getFilm(page = 1) {
    const movie = searchInput.value.trim();
    clearBtn.style.display = movie ? "block" : "none";

    const result = await movieApi.searchMovieFound(movie, page);
    moviesContainer.innerHTML = "";

    if (!result.results?.length) {
        moviesContainer.innerHTML = "<p>Film bulunamadı.</p>";
        return;
    }

    result.results.forEach(film => {
        const vote = film.vote_average ?? 0;
        moviesContainer.innerHTML += `
            <div class="movie">
                <img class="moviePicture" src="${film.poster_path ? movieApi.baseImageURL + film.poster_path : "../photo/black.jpg"}" alt="">
                <div class="info">
                    <h4 class="movieName">${film.title}</h4>
                    <h5 class="imdbPoint" style="background-color:${movieApi.getIMDBcolor(vote)};">${vote.toFixed(1)} IMDB</h5>
                </div>
            </div>
        `;
    });
}

async function getMoviesFromAPI(page = 1) {
    const movies = await movieApi.getMovies(page);
    moviesContainer.innerHTML = "";

    if (!movies.length) {
        moviesContainer.innerHTML = "<p>Film bulunamadı.</p>";
        return;
    }

    movies.forEach(movie => {
        const vote = movie.vote_average ?? 0;

        const div = document.createElement("div");
        div.classList.add("movie");

        const img = document.createElement("img");
        img.classList.add("moviePicture");
        img.src = movie.poster_path ? movieApi.baseImageURL + movie.poster_path : "../photo/black.jpg";

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info");

        const h4 = document.createElement("h4");
        h4.classList.add("movieName");
        h4.textContent = movie.title;

        const h5 = document.createElement("h5");
        h5.classList.add("imdbPoint");
        h5.textContent = `${vote.toFixed(1)} IMDB`;
        h5.style.backgroundColor = movieApi.getIMDBcolor(vote);

        infoDiv.appendChild(h4);
        infoDiv.appendChild(h5);
        div.appendChild(img);
        div.appendChild(infoDiv);
        moviesContainer.appendChild(div);
    });
}
