'use strict';
document.addEventListener('DOMContentLoaded', init);

let currentPage = 1; 
const apiKey = '98669537';

function init() {
    document.getElementById('searchButton').addEventListener('click', handleSearch);
}

function handleSearch(event) {
    event.preventDefault();
    currentPage = 1; 
    searchMovies();
}

function searchMovies() {
    const searchInput = document.getElementById('searchInput').value;
    const type = document.getElementById('typeSelect').value; 
    const moviesGrid = document.getElementById('moviesGrid');
    
    if (searchInput.trim() === '') {
        alert('Enter a movie title then search!');
        return;
    }

    moviesGrid.innerHTML = '<p>Loading movies...</p>';
    
    fetchMoviesData(searchInput, type, currentPage)
        .then(data => {
            if (data.Search && data.Search.length > 0) {
                displayMovies(data.Search, data.totalResults);
            } else {
                moviesGrid.innerHTML = '<p>No movie found with the given name!</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            moviesGrid.innerHTML = '<p>Error fetching movies. Please try again later.</p>';
        });
}

function fetchMoviesData(searchInput, type, page) {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchInput}&type=${type}&page=${page}`;
    return fetch(url).then(response => response.json());
}

function displayMovies(movies, totalResults) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = ''; 

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });

    attachDetailButtons(); 
    showPagination(totalResults); 
}

function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
        <div class="movie-card__image">
            <img src="${movie.Poster}" alt="${movie.Title}">
        </div>
        <div class="movie-card__head">
            <h2 class="movie-card__title">${movie.Title}</h2>
            <p class="movie-card__year">${movie.Year}</p>
        </div>
        <a href="#details" id="buttonDetails" class="button button--details" data-imdbid="${movie.imdbID}">Details</a>
    `;
    return movieCard;
}

function attachDetailButtons() {
    const detailButtons = document.querySelectorAll('.button--details');
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imdbID = this.getAttribute('data-imdbid');
            fetchMovieDetails(imdbID);
        });
    });
}

function fetchMovieDetails(imdbID) {
    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = '<p>Loading movie details...</p>';
    
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`)
        .then(response => response.json())
        .then(data => displayMovieDetails(data))
        .catch(error => {
            console.error('Error fetching movie details:', error);
            detailsDiv.innerHTML = '<p>Error fetching movie details. Please try again later.</p>';
        });
}

function displayMovieDetails(data) {
    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <div class="movie-detail">
            <img src="${data.Poster}" alt="${data.Title}" class="movie-detail__poster">
            <div class="movie-detail__info">
                <h2 class="movie-detail__title">${data.Title}</h2>
                <p class="movie-detail__imdb">IMDb Rating: ${data.imdbRating}</p>
                <p class="movie-detail__plot">${data.Plot}</p>
            </div>
        </div>
    `;
    detailsDiv.style.display = 'block'; 
    scrollToDetailsWithDelay();
}

function showPagination(totalResults) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; 
    const totalPages = Math.ceil(totalResults / 10);
    
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPageButton(i);
            pagination.appendChild(pageButton);
        }
    }
}

function createPageButton(pageNumber) {
    const pageButton = document.createElement('button');
    pageButton.textContent = pageNumber;
    pageButton.classList.add('button');
    pageButton.addEventListener('click', function() {
        currentPage = pageNumber;
        searchMovies(); 
    });
    return pageButton;
}

function scrollToDetailsWithDelay() {
    setTimeout(function() {
        document.getElementById('details').scrollIntoView({ behavior: 'smooth' });
    }, 300); 
}
