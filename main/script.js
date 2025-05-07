
function removeVietnameseTones(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim();
}

// API helpers
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error("Fetch error:", err);

    return null;
  }
}

async function filterMovies(searchTerm) {
  if (!searchTerm) return [];
  searchTerm = searchTerm.toLowerCase();
  console.log("alo", searchTerm);
  const movieRaw = await fetchData(`https://phim.nguonc.com/api/films/search?keyword=${searchTerm}`);
  console.log(`https://phim.nguonc.com/api/films/search?keyword=${searchTerm}`);
  return movieRaw.items;

}


//search
const searchInput = document.querySelector('.search-input');
const suggestionBox = document.querySelector('.suggestion-box');
let debounceTimer;
let loadingTimer;
let isLoading = false;

// Function to show loading state
function showLoading() {
  isLoading = true;
  suggestionBox.innerHTML = '';

  // Create loading animation
  const loadingContainer = document.createElement('div');
  loadingContainer.className = 'loading-container';

  // Create pulse loading
  const loadingPulse = document.createElement('div');
  loadingPulse.className = 'loading-pulse';
  loadingPulse.innerHTML = '<div></div><div></div><div></div>';

  loadingContainer.appendChild(loadingPulse);
  suggestionBox.appendChild(loadingContainer);

  // Add shimmer loading items
  for (let i = 0; i < 4; i++) {
    const loadingItem = document.createElement('div');
    loadingItem.className = 'loading-item';
    loadingItem.innerHTML = `
              <div class="loading-poster shimmer"></div>
              <div class="loading-lines">
                  <div class="loading-title shimmer"></div>
                  <div class="loading-year shimmer"></div>
              </div>
          `;
    suggestionBox.appendChild(loadingItem);
  }

  suggestionBox.classList.add('visible');
}

// Function to filter movies based on search term

// Function to render suggestion items
function renderSuggestions(suggestions) {
  isLoading = false;
  suggestionBox.innerHTML = '';
  console.log(suggestions)
  if (suggestions.length === 0) {
    suggestionBox.innerHTML = '<div class="suggestion-item">Không tìm thấy kết quả phù hợp</div>';
    return;
  }

  for (let i = 0; i < 5; i++) {
    let movie = suggestions[i];
    const item = document.createElement('div');
    // const cate = movie.cate
    item.className = 'suggestion-item';

    item.innerHTML = `
              <img class="suggestion-poster" src="${movie.thumb_url}" alt="${movie.name}">
              <div class="suggestion-info">
                  <div class="suggestion-title">${movie.name}</div>
                  <div class="suggestion-year">${movie.original_name}</div>
                  <div class="suggestion-year">
                                                   <span class="genre-tag">${movie.quality}</span>
                                                   <span class="genre-tag">${movie.language}</span>
                                                   <span class="genre-tag">${movie.current_episode}</span>
                                                   
                          </div>
          `;

    // Add click event to suggestion item
    item.addEventListener('click', () => {
      searchInput.value = movie.name;
      suggestionBox.classList.remove('visible');
      window.location = `/pages/chi-tiet.html?phim=${movie.slug}`
      // console.log(movie.slug);
    });

    suggestionBox.appendChild(item);
  }
  if (suggestions.length > 3) {
    const showAllBtn = document.createElement('div');
    showAllBtn.className = 'show-all-btn';
    showAllBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
        </svg>
        Xem tất cả kết quả +(${suggestions.length})
    `;

    showAllBtn.addEventListener('click', () => {
      window.location = `/pages/danh-sach.html?search=${searchInput.value}`;
    });

    suggestionBox.appendChild(showAllBtn);
  }
}

// Event listener for input changes with debounce and loading
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  clearTimeout(loadingTimer);

  if (searchInput.value.trim() === '') {
    suggestionBox.classList.remove('visible');
    isLoading = false;
    return;
  }

  // Show loading after a short delay
  loadingTimer = setTimeout(() => {
    if (searchInput.value.trim() !== '') {
      showLoading();
    }
  }, 300);

  // Actual search with debounce
  debounceTimer = setTimeout(async () => {
    if (searchInput.value.trim() !== '') {
      const filteredMovies = await filterMovies(searchInput.value);
      // console.log(filteredMovies);
      renderSuggestions(filteredMovies);
      suggestionBox.classList.add('visible');
    }
  }, 1000);
});

// Event listener for Enter key press
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    console.log(searchInput.value);
    window.location = `/pages/danh-sach.html?search=${searchInput.value}`
    // window.location = `/demo2.html`

    clearTimeout(debounceTimer);
    clearTimeout(loadingTimer);
    suggestionBox.classList.remove('visible');
    isLoading = false;
  }
});

// Close suggestion box when clicking outside
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
    suggestionBox.classList.remove('visible');
    clearTimeout(debounceTimer);
    clearTimeout(loadingTimer);
    isLoading = false;
  }
});


// Focus in search input


searchInput.addEventListener('focus', async () => {
  if (searchInput.value.trim() !== '' && !isLoading) {
    const filteredMovies = await filterMovies(searchInput.value);
    renderSuggestions(filteredMovies);
    suggestionBox.classList.add('visible');
  }
});




//dropdown country
const countries = [
  { code: 'us', name: 'Âu Mỹ' },
  { code: 'gb', name: 'Anh' },
  { code: 'cn', name: 'Trung Quốc' },
  { code: 'id', name: 'Indonesia' },
  { code: 'vn', name: 'Việt Nam' },
  { code: 'fr', name: 'Pháp' },
  { code: 'hk', name: 'Hồng Kông' },
  { code: 'kr', name: 'Hàn Quốc' },
  { code: 'jp', name: 'Nhật Bản' },
  { code: 'th', name: 'Thái Lan' },
  { code: 'tw', name: 'Đài Loan' },
  { code: 'ru', name: 'Nga' },
  { code: 'nl', name: 'Hà Lan' },
  { code: 'ph', name: 'Philippines' },
  { code: 'in', name: 'Ấn Độ' }
];

const countryTab = document.querySelector('.country-tab');
const dropdown = document.getElementById('countryDropdown');
const countriesGrid = document.getElementById('countriesGrid');

// Populate countries grid
countries.forEach(country => {
  const countryItem = document.createElement('div');
  countryItem.className = 'country-item';
  countryItem.innerHTML = `
      <img class="country-flag" src="https://flagcdn.com/w40/${country.code}.png" alt="${country.name} flag">
      <span class="country-name">${country.name}</span>
    `;

  countryItem.addEventListener('click', () => {
    // Remove selected class from all items
    document.querySelectorAll('.country-item').forEach(item => {
      item.classList.remove('selected');
    });

    // Add selected class to this item
    countryItem.classList.add('selected');

    // You would typically trigger a filter/navigation action here
    console.log(`Selected country: ${country.name}`);
    window.location = `/pages/danh-sach.html?quoc-gia=${removeVietnameseTones(country.name)}`;

    // Close dropdown after selection
    dropdown.classList.remove('active');
  });

  countriesGrid.appendChild(countryItem);
});

// Toggle dropdown
countryTab.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!countryTab.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});


// Update Hero section
async function updateHero(slug) {
  // console.log("api", `https://phim.nguonc.com/api/film/${slug}`);
  const data = await fetchData(`https://phim.nguonc.com/api/film/${slug}`);
  // const data = await fetchData(`https://ophim1.com/phim/${slug}`);
  console.log(`https://ophim1.com/phim/${slug}`);
  if (!data) return;

  document.querySelector(".movie-title-hero").textContent = data.movie.name;
  document.querySelector(".imdb-rating").textContent = data.movie.quality;
  document.querySelector(".language").textContent = data.movie.language;
  document.querySelector(".created").textContent = data.movie.created.split("-")[0];
  document.querySelector(".current_episode").textContent = data.movie.current_episode;
  document.querySelector(".time").textContent = data.movie.time;
  document.querySelector(".controls").innerHTML = `<div class="play-btn">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
  <path d="M8 5v14l11-7z"/>
  </svg>
                    </div>
                    
                    <div class="action-btn favourite-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
                    </svg>
                    </div>
                    
                    <div class="action-btn info-btn" href = "/pages/chi-tiet.html">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2V6h-2v3z"/>
                    </svg>
                    </div>`;

  const genreTag = document.querySelector(".categories");
  genreTag.innerHTML = data.movie.category["2"]["list"]
    .map(item => `<a href="/pages/danh-sach.html?the-loai=${removeVietnameseTones(item.name)}" class="category">${item.name}</a>`)
    .join('');

  document.querySelector(".hero-description").innerHTML = `<p>${data.movie.description}</p>`;

  // Navigation buttons
  document.querySelector(".info-btn")?.addEventListener("click", () => {
    // alert(`${slug}`);
    window.location = `/pages/chi-tiet.html?phim=${slug}`;
  });
  document.querySelector(".play-btn")?.addEventListener("click", () => {
    // alert(`${slug}`);
    window.location = `/pages/watch.html?phim=${slug}&&tap=1&&server=0`;
  });

}

// Setup banner and thumbnails
async function setupBanner() {
  const banner = document.querySelector(".hero");
  const thumbContainer = document.querySelector(".thumbnails");

  const filmList = await fetchData("https://phim.nguonc.com/api/films/the-loai/khoa-hoc-vien-tuong?page=156");
  if (!filmList || !filmList.items.length) return;

  const thumbnailsHTML = filmList.items.slice(2, 9).map((film, index) => {
    const activeClass = index === 0 ? "active" : "";
    return `<img class="thumbnail ${activeClass}" id="${film.slug}" src="${film.poster_url}">`;
  }).join('');

  banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${filmList.items[2].poster_url}) center/cover`;
  thumbContainer.innerHTML = thumbnailsHTML;
  document.querySelector(".movie-details").classList.add("trans");

  // console.log(filmList);
  await updateHero(filmList.items[2].slug);
  setupThumbnailEvents();
}

// Handle thumbnail click
function setupThumbnailEvents() {
  const thumbnails = document.querySelectorAll(".thumbnail");

  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", async () => {
      thumbnails.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");

      const img = thumb.src;
      document.querySelector(".hero").classList.add("fade");
      document.querySelector(".movie-details").classList.remove("trans");

      setTimeout(async () => {
        document.querySelector(".hero").style.background = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${img}) center/cover`;
        await updateHero(thumb.id);
        document.querySelector(".hero").classList.remove("fade");
        document.querySelector(".movie-details").classList.add("trans");
      }, 50)


    });
  });
}

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  header.classList.toggle('scrolled', window.scrollY > 50);
});


// Init everything
setupBanner();


// //CAROUSEL
async function updateCarousel(country, title, subtitle) {
  const movieData = await fetchData(`https://phim.nguonc.com/api/films/quoc-gia/${country}`);
  if (!movieData?.items?.length) return;

  const section = document.getElementById("movie-container-hero");

  // Tạo HTML cho 1 movie-section mới
  const wrapper = document.createElement("div");
  wrapper.className = "movie-section";
  wrapper.innerHTML = `
    <div class="section-header">
      <div class="section-title">
        <h2 >${title}</h2>
        <span>${subtitle}</span>
      </div>
      <a href="/pages/danh-sach.html?quoc-gia=${country}" class="view-all">
        Xem toàn bộ →
      </a>
    </div>
    
    <div class="movie-carousel">
    <div id="movie-container-${country}" class="movie-container"></div>
    <div class="carousel-nav">
    <button class="nav-button prev-btn" aria-label="Previous movies">❮</button>
      <button class="nav-button next-btn" aria-label="Next movies">❯</button>
    </div>
    </div>
    </div>
  `;

  // Chèn vào section chính
  section.appendChild(wrapper);

  // Các phần tử DOM
  const container = wrapper.querySelector(`#movie-container-${country}`);
  const prevBtn = wrapper.querySelector(".prev-btn");
  const nextBtn = wrapper.querySelector(".next-btn");
  const carousel = wrapper.querySelector(".movie-carousel");

  // let position = 0;
  // const cardWidth = 486;

  // Generate cards
  function generateCards() {
    container.innerHTML = '';

    for (const film of movieData.items) {
      // const detail = await fetchData(`https://phim.nguonc.com/api/film/${film.slug}`);
      // const movie = detail.movie;
      const movie = film;
      // console.log(movie.poster_url);

      const cardTemplate = document.getElementById("movie-card-template");
      const card = document.importNode(cardTemplate.content, true);
      // card.id = movie.slug;
      // console.log("as",card);
      //  card.setAttribute("id", movie.slug);
      const img = card.querySelector('img');
      // console.log(img);
      img.src = movie.poster_url;
      // img.alt = movie.name;

      card.querySelector('.movie-title').textContent = movie.name;
      card.querySelector('.movie-info h3').textContent = movie.name;
      // card.querySelector('.imdb-rating').textContent = movie.quality || '';
      // card.querySelector('.movie-episode').textContent = movie.time || '';
      // card.querySelector('.movie-description').textContent = movie.description || '';
      // card.querySelector('.movie-year').textContent = movie?.category?.["3"]?.list?.name || '';

      const tags = card.querySelector(".movie-tags");
      tags.innerHTML = "";
      if (movie.language) {
        const tagLang = document.createElement("span");
        tagLang.className = "tag pd-tag";
        tagLang.textContent = movie.language;
        tags.appendChild(tagLang);
      }

      if (movie.current_episode) {
        const tagEp = document.createElement("span");
        tagEp.className = "tag tm-tag";
        tagEp.textContent = movie.current_episode;
        tags.appendChild(tagEp);
      }


      // const genres = card.querySelector(".movie-genres");
      // genres.innerHTML = "";
      // movie.category?.["2"]?.list?.forEach(genre => {
      //   const g = document.createElement("span");
      //   g.className = "genre-tag";
      //   g.textContent = genre.name;
      //   genres.appendChild(g);
      // });

      const action = card.querySelector(".movie-card");
      action.addEventListener("click", () => {
        console.log(movie.slug);
        window.location = `/pages/chi-tiet.html?phim=${film.slug}`;
      })

      // const watch = action.querySelector(".watch-btn");
      // watch.addEventListener("click", () => {
      //   console.log(film.slug);
      //   window.location = `/pages/watch.html?phim=${film.slug}`;
      // });

      // const infor = action.querySelector(".details-btn");
      // infor.addEventListener("click", () => {
      //   console.log(film.slug);
      //   window.location = `/pages/chi-tiet.html?phim=${film.slug}`;
      // });
      container.appendChild(card);
      // console.log(card);

    }

    calculateCardDimensions();
  }

  let currentPosition = 0;
  let cardWidth = 0;
  let visibleCards = 0;
  let totalCards = 10;
  let maxPosition = 0;

  // Calculate card dimensions based on screen size
  function calculateCardDimensions() {
    // Get carousel width
    const carouselWidth = container.parentElement.offsetWidth;

    // Calculate how many cards should be visible
    if (window.innerWidth >= 1553) {
      visibleCards = 4; // 5 cards on large screens
    } else if (window.innerWidth >= 992) {
      visibleCards = 4; // 4 cards on medium-large screens
    } else if (window.innerWidth >= 768) {
      visibleCards = 3; // 3 cards on medium screens
    } else if (window.innerWidth >= 576) {
      visibleCards = 2; // 2 cards on small screens
    } else {
      visibleCards = 1; // 1 card on extra small screens
    }

    // Calculate card width based on visible cards and gap
    const gapWidth = 16; // gap between cards
    cardWidth = (carouselWidth - (gapWidth * (visibleCards - 1))) / visibleCards;

    // Set card width
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach(card => {
      card.style.width = `${cardWidth}px`;
    });

    // Calculate maximum position
    maxPosition = Math.max(0, totalCards - visibleCards);

    // Reset position if needed
    if (currentPosition > maxPosition) {
      currentPosition = maxPosition;
      updateCarouselPosition();
    }

    // Update button states
    updateButtonStates();
  }
  // Update carousel position
  function updateCarouselPosition() {
    const gapWidth = 16; // gap between cards
    const offset = currentPosition * (cardWidth + gapWidth);
    container.style.transform = `translateX(-${offset}px)`;
    updateButtonStates();
  }

  // Update button states
  function updateButtonStates() {
    prevBtn.disabled = currentPosition === 0;
    nextBtn.disabled = currentPosition >= maxPosition;
  }

  // Next button click handler
  nextBtn.addEventListener('click', () => {
    if (currentPosition < maxPosition) {
      currentPosition++;
      updateCarouselPosition();
    }
  });

  // Previous button click handler
  prevBtn.addEventListener('click', () => {
    if (currentPosition > 0) {
      currentPosition--;
      updateCarouselPosition();
    }
  });

  // Window resize handler
  window.addEventListener('resize', () => {
    calculateCardDimensions();
    updateCarouselPosition();
  });

  // Initialize
  generateCards();
  updateButtonStates();

}
document.addEventListener("DOMContentLoaded", updateCarousel("viet-nam", "Phim Việt Nam", "Khung giờ vàng"));
document.addEventListener("DOMContentLoaded", updateCarousel("han-quoc", "Phim Hàn ", "Drama nảy lửa"));
document.addEventListener("DOMContentLoaded", updateCarousel("nhat-ban", "Phim Nhật", "Động anime"));

