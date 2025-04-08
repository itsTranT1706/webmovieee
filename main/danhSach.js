
const url = window.location.search;
const urlParams = new URLSearchParams(url);
const param1 = url.match(/\?([^=]*)=/);
const param2 = urlParams.get(param1[1]);
console.log(`https://phim.nguonc.com/api/films/${param1[1]}/${param2}`);
const index = 1;

//pagination
// Configuration
// fetch(`https://phim.nguonc.com/api/films/${param1[1]}/${param2}?page=${index}`)
// .then(response => response.json())
// .then(data => {

// });
fetch(`https://phim.nguonc.com/api/films/${param1[1]}/${param2}`)
.then(response => response.json())
.then(data => {
let currentPage = data.paginate.current_page;
let itemsPerPage = data.paginate.items_per_page;
const totalItems = data.paginate.total_items; // Example: 12,000 movies
console.log(data.paginate.total_items)

// Calculate total pages
let totalPages = Math.ceil(totalItems / itemsPerPage);

// DOM elements
const paginationElement = document.getElementById('pagination');
const movieGridElement = document.querySelector('.movieGrid');

// Function to generate pagination
function generatePagination() {
    paginationElement.innerHTML = '';

    // Create the structure

    // Previous button
    const prevButton = createPaginationButton('«', currentPage > 1, () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    });
    prevButton.classList.add('nav-button');
    paginationElement.appendChild(prevButton);

    // Page numbers with smart ellipsis
    const pageButtons = determinePageButtons();
    // console.log("xin chao banj", pageButtons);
    pageButtons.forEach(item => {
        if (item === '...') {
            // Ellipsis
            const ellipsisLi = document.createElement('li');
            const ellipsisButton = document.createElement('button');
            ellipsisButton.textContent = '...';
            ellipsisButton.classList.add('ellipsis');
            ellipsisButton.disabled = true;
            ellipsisLi.appendChild(ellipsisButton);
            paginationElement.appendChild(ellipsisLi);
        } else {
            // Page number
            const isActive = currentPage === item;
            const pageButton = createPaginationButton(item, true, () => goToPage(item));

            if (isActive) {
                pageButton.classList.add('active');
            }

            // Add class for responsive hiding on mobile if needed
            if (shouldHideOnMobile(item)) {
                pageButton.classList.add('mobile-hide');
            }

            paginationElement.appendChild(pageButton);
        }
    });

    // Next button
    const nextButton = createPaginationButton('»', currentPage < totalPages, () => {
        if (currentPage < totalPages) goToPage(currentPage + 1);
    });
    nextButton.classList.add('nav-button');
    paginationElement.appendChild(nextButton);

    // Update page info text
    updatePageInfo();
}

// Helper function to create pagination button
function createPaginationButton(text, enabled, clickHandler) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = !enabled;
    button.addEventListener('click', clickHandler);
    li.appendChild(button);
    return li;
}

// Function to decide which page buttons to show
function determinePageButtons() {
    let pageButtons = [];

    // Always show first page
    pageButtons.push(1);

    // Logic for showing pages around current page with ellipsis
    if (currentPage > 3) {
        pageButtons.push('...');
    }

    // Pages around current page
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        // console.log(i)
        pageButtons.push(i);
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 3) {
        // console.log(totalPages-3);
        pageButtons.push('...');
        // console.log(pageButtons);
    }

    // Always show last page if we have more than 1 page
    if (totalPages > 1) {
        pageButtons.push(totalPages);
    }

    return pageButtons;
}

// Function to determine if a page button should be hidden on mobile
function shouldHideOnMobile(pageNum) {
    // On mobile, show fewer pages around current page
    if (pageNum !== 1 && pageNum !== totalPages &&
        pageNum !== currentPage &&
        pageNum !== currentPage - 1 &&
        pageNum !== currentPage + 1) {
        return true;
    }
    return false;
}

// Function to navigate to a page
function goToPage(page) {
    currentPage = page;
    loadMovies(currentPage);
    generatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadMovies(index) {
    fetch(`https://phim.nguonc.com/api/films/${param1[1]}/${param2}?page=${index}`)
    .then(response => response.json())
    .then(data => {
    // Fetch movies for the current page
            console.log(data);
            if (param2 != "") {
                document.querySelector("header").innerHTML = `<h1>${data.cat.title}</h1>`;

            }
            let moveList = document.querySelector("#move-list");
            // console.log(moveList);
            let arr = data.items.map((movie) => {
                return ` <div class="movie-card" data-genre="drama">
            <img src="${movie.poster_url}" alt="Movie 1">
            <div class="movie-info">
                <span class="rating">PD: 4</span>
                <span class="episodes">TM: 4</span>
            </div>
            <h3>${movie.name}</h3>
            <p>${movie.director}</p>
        </div>  `

            })
            let s = "";
            for (let i = 0; i < arr.length; i++) {
                s += arr[i];
            }
            moveList.innerHTML = s;
    });
       
}
// Initialize the page
function init() {
    loadMovies(currentPage);
    generatePagination();
}

// Run initialization
init()
})
.catch((e)=> {
    alert("Đợi xíu bạn ơii");
})