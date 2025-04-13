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
  
  // Update Hero section
  async function updateHero(slug) {
    const data = await fetchData(`https://phim.nguonc.com/api/film/${slug}`);
    if (!data) return;
  
    document.querySelector(".movie-title-hero").textContent = data.movie.name;
    document.querySelector(".imdb-rating").textContent = data.movie.quality;
    document.querySelector(".language").textContent = data.movie.language;
    document.querySelector(".created").textContent = data.movie.created.split("-")[0];
    document.querySelector(".current_episode").textContent = data.movie.current_episode;
    document.querySelector(".time").textContent = data.movie.time;
  
    const genreTag = document.querySelector(".categories");
    genreTag.innerHTML = data.movie.category["2"]["list"]
      .map(item => `<a href="/pages/danh-sach.html?the-loai=${removeVietnameseTones(item.name)}" class="category">${item.name}</a>`)
      .join('');
  
    document.querySelector(".hero-description").innerHTML = `<p>${data.movie.description}</p>`;
  }
  
  // Setup banner and thumbnails
  async function setupBanner() {
    const banner = document.querySelector(".hero");
    const thumbContainer = document.querySelector(".thumbnails");
  
    const filmList = await fetchData("https://phim.nguonc.com/api/films/the-loai/kinh-di");
    if (!filmList || !filmList.items.length) return;
  
    const thumbnailsHTML = filmList.items.slice(0, 7).map((film, index) => {
      const activeClass = index === 0 ? "active" : "";
      return `<img class="thumbnail ${activeClass}" id="${film.slug}" src="${film.poster_url}">`;
    }).join('');
  
    banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${filmList.items[0].poster_url}) center/cover`;
    thumbContainer.innerHTML = thumbnailsHTML;
  
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
        document.querySelector(".hero").style.background = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${img}) center/cover`;
  
        await updateHero(thumb.id);
      });
    });
  }
  
  // Slide functionality
  let currentIndex = 0;
  function nextSlide() {
    const list = document.querySelector(".movie-list");
    if (currentIndex < list.children.length - 2) {
      currentIndex++;
      list.style.transform = `translateX(-${currentIndex * 220}px)`;
    }
  }
  function prevSlide() {
    const list = document.querySelector(".movie-list");
    if (currentIndex > 0) {
      currentIndex--;
      list.style.transform = `translateX(-${currentIndex * 220}px)`;
    }
  }
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
  
  // Navigation buttons
  document.querySelector(".info-btn")?.addEventListener("click", () => {
    window.location = "/pages/chi-tiet.html";
  });
  document.querySelector(".play-btn")?.addEventListener("click", () => {
    window.location = "/pages/watch.html";
  });
  
  // Init everything
  setupBanner();
  