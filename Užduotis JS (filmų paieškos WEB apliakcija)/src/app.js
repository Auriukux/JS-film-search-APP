document.addEventListener('DOMContentLoaded', () => {
    const apiKey = process.env.FILM_SEARCH_API_KEY;

    if (document.body.id === 'index-page') {
        initIndexPage(apiKey);
    } else if (document.body.id === 'details-page') {
        initMovieDetailsPage(apiKey);
    }
});

function initIndexPage(apiKey) {
    const form = document.getElementById('movie-search-form');
    const searchInput = document.getElementById('movie-search');
    const resultsContainer = document.getElementById('movie-results');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchMovies(searchTerm, apiKey);
        }
    });

    async function fetchMovies(searchTerm, apiKey) {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`);
        const data = await response.json();
        if (data.Response === 'True') {
            displayMovies(data.Search);
        }
    }

    function displayMovies(movies) {
        resultsContainer.innerHTML = '';
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('col-md-3', 'mb-3');
            movieCard.innerHTML = `
                <div class="card movie-card">
                    <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <p class="card-text">Metai: ${movie.Year}</p>
                        <button class="btn-center" onclick="showMovieDetails('${movie.imdbID}')">Daugiau informacijos</button>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(movieCard);
        });
    }
    
    window.showMovieDetails = function (imdbID) {
        window.open(`movie-details.html?id=${imdbID}`, '_blank');
    };
}

function initMovieDetailsPage(apiKey) {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('id');

    if (imdbID) {
        fetchMovieDetails(imdbID, apiKey);
    }

    async function fetchMovieDetails(imdbID, apiKey) {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
        const movie = await response.json();
        displayMovieDetails(movie);
    }

    function displayMovieDetails(movie) {
        if (movie.Response === 'True') {
            document.getElementById('movie-details').innerHTML = `
                <div class="row">
                    <div class="col-md-4 text-center">
                        <img src="${movie.Poster}" class="img-fluid" alt="${movie.Title} Poster">
                    </div>
                    <div class="col-md-8">
                        <h2>${movie.Title}</h2>
                        <p><strong>Siužetas:</strong> ${movie.Plot}</p>
                        <p><strong>Režisierius:</strong> ${movie.Director}</p>
                        <p><strong>Aktoriai:</strong> ${movie.Actors}</p>
                        <p><strong>IMDb įvertinimas:</strong> ${movie.imdbRating}</p>
                        <button class="btn btn-info" onclick="window.close();">Uždaryti</button>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('movie-details').innerHTML = `<p>Filmas nerastas.</p>`;
        }
    }
}

