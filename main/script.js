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

function loading(content) {
    content.classList.add("loader");
}

// Update Hero section
async function updateHero(slug) {
  // console.log("api", `https://phim.nguonc.com/api/film/${slug}`);
  const data = await fetchData(`https://phim.nguonc.com/api/film/${slug}`);
  // const data = await fetchData(`https://ophim1.com/phim/${slug}`);
  console.log(`https://ophim1.com/phim/${slug}`);
  if (!data) return ;

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
    window.location = `/pages/watch.html?phim=${slug}`;
  });

}

// Setup banner and thumbnails
async function setupBanner() {
  const banner = document.querySelector(".hero");
  const thumbContainer = document.querySelector(".thumbnails");

  const filmList = await fetchData("https://phim.nguonc.com/api/films/the-loai/khoa-hoc-vien-tuong?page=155");
  if (!filmList || !filmList.items.length) return ;

  const thumbnailsHTML = filmList.items.slice(0, 7).map((film, index) => {
    const activeClass = index === 0 ? "active" : "";
    return `<img class="thumbnail ${activeClass}" id="${film.slug}" src="${film.poster_url}">`;
  }).join('');

  banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${filmList.items[0].poster_url}) center/cover`;
  // banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(https://static.nutscdn.com/vimg/1920-0/b4fd3fdce37b78a0ef03953dce061771.jpg) center/cover`;
  thumbContainer.innerHTML = thumbnailsHTML;

  // console.log(filmList);
  await updateHero(filmList.items[0].slug);
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
      // document.querySelector(".hero").classList.add("hidden");
      document.querySelector(".hero").style.background = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${img}) center/cover`;
      await updateHero(thumb.id);

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




//CAROUSEL
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
        <h2>${title}</h2>
        <span>${subtitle}</span>
      </div>
      <a href="/pages/danh-sach.html?quoc-gia=${country}" class="view-all">
        Xem toàn bộ →
      </a>
    </div>
    
    <div class="movie-carousel">
      <button class="nav-button prev-btn" aria-label="Previous movies">❮</button>
      <div id="movie-container-${country}" class="movie-container"></div>
      <button class="nav-button next-btn" aria-label="Next movies">❯</button>
    </div>
  `;

  // Chèn vào section chính
  section.appendChild(wrapper);

  // Các phần tử DOM
  const container = wrapper.querySelector(`#movie-container-${country}`);
  const prevBtn = wrapper.querySelector(".prev-btn");
  const nextBtn = wrapper.querySelector(".next-btn");
  const carousel = wrapper.querySelector(".movie-carousel");

  let position = 0;
  const cardWidth = 265;

  for (const film of movieData.items) {
    const detail = await fetchData(`https://phim.nguonc.com/api/film/${film.slug}`);
    const movie = detail.movie;

    const cardTemplate = document.getElementById("movie-card-template");
    const card = document.importNode(cardTemplate.content, true);

    const img = card.querySelector('img');
    console.log(img);
    img.src = movie.thumb_url;
    img.alt = movie.name;

    card.querySelector('.movie-title').textContent = movie.name;
    card.querySelector('.movie-info h3').textContent = movie.name;
    card.querySelector('.imdb-rating').textContent = movie.quality || '';
    card.querySelector('.movie-episode').textContent = movie.time || '';
    card.querySelector('.movie-description').textContent = movie.description || '';
    card.querySelector('.movie-year').textContent = movie?.category?.["3"]?.list?.name || '';

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

    const genres = card.querySelector(".movie-genres");
    genres.innerHTML = "";
    movie.category?.["2"]?.list?.forEach(genre => {
      const g = document.createElement("span");
      g.className = "genre-tag";
      g.textContent = genre.name;
      genres.appendChild(g);
    });

    const action = card.querySelector(".action-buttons");
    const watch  = action.querySelector(".watch-btn");
    watch.addEventListener("click",()=>{
      console.log(film.slug);
      window.location = `/pages/watch.html?phim=${film.slug}`;
    });
    const infor = action.querySelector(".details-btn");
    infor.addEventListener("click",()=>{
      console.log(film.slug);
      window.location = `/pages/chi-tiet.html?phim=${film.slug}`;
    });
    container.appendChild(card);
    
  }

  // Điều khiển điều hướng
  const visibleCards = Math.floor(carousel.clientWidth / cardWidth);
  const totalCards = container.children.length;
  const maxPosition = Math.min(0, carousel.clientWidth - totalCards * cardWidth);

  function updateNavButtons() {
    prevBtn.disabled = position >= 0;
    nextBtn.disabled = position <= maxPosition;
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '0.8';
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '0.8';
  }

  function moveCarousel(delta) {
    const newPosition = Math.max(Math.min(position + delta, 0), maxPosition);
    if (newPosition !== position) {
      position = newPosition;
      container.style.transform = `translateX(${position}px)`;
      updateNavButtons();
    }
  }

  prevBtn.addEventListener("click", () => moveCarousel(cardWidth * visibleCards));
  nextBtn.addEventListener("click", () => moveCarousel(-cardWidth * visibleCards));
  updateNavButtons();

  if ('ontouchstart' in window) {
    let startX = 0;
    container.addEventListener("touchstart", e => startX = e.touches[0].clientX, { passive: true });
    container.addEventListener("touchend", e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        moveCarousel(diff > 0 ? cardWidth * visibleCards : -cardWidth * visibleCards);
      }
    }, { passive: true });
  }
}
document.addEventListener("DOMContentLoaded", updateCarousel("han-quoc", "Phim Hàn ", "Drama nảy lửa"));
document.addEventListener("DOMContentLoaded", updateCarousel("trung-quoc", "Phim Trung", "Ngôn tình hấp dẫn"));
document.addEventListener("DOMContentLoaded", updateCarousel("nhat-ban", "Phim Nhật", "Anime học đường"));

