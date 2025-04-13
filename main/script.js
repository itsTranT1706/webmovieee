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
  

  //carousel
   // Movie data
   const movies = [
    {
      title: "Bảo Hiểm Ly Hôn",
      img: "https://phim.nguonc.com/public/images/Post/3/trai-tim-chon-vui.jpg",
      tags: { pd: 4, tm: 2 },
      rating: "7.5",
      year: "2023",
      episode: "Tập 4",
      description: "Câu chuyện về một cặp đôi đã ly hôn nhưng phải sống chung nhà vì hợp đồng bảo hiểm đặc biệt.",
      genres: ["Lãng mạn", "Hài hước"]
    },
    {
      title: "Lưỡi Dao Hiểm Hóc",
      img: "https://phim.nguonc.com/public/images/Post/2/dat-nuoc-cua-phan-dien.jpg",
      tags: { pd: 6, tm: 6 },
      rating: "7.9",
      year: "2023",
      episode: "Tập 6",
      description: "Bộ phim trinh thám theo chân một nữ thám tử tài năng điều tra vụ án giết người hàng loạt gây chấn động.",
      genres: ["Hình Sự", "Gay Cấn", "Tâm Lý"]
    },
    {
      title: "Quán Ăn của Ngài Heo",
      img: "https://phim.nguonc.com/public/images/Post/4/bac-thay-dam-phan.jpg",
      tags: { pd: 6 },
      rating: "8.1",
      year: "2023",
      episode: "Tập 6",
      description: "Câu chuyện lãng mạn về một đầu bếp tài năng và người chủ quán ăn cổ trong thời kỳ Joseon.",
      genres: ["Lãng mạn", "Lịch sử", "Ẩm thực"]
    },
    {
      title: "Hoàng Hậu Ki",
      img: "https://phim.nguonc.com/public/images/Post/1/hoi-ban-trai-cua-bunny-1.jpg",
      tags: { pd: 5, tm: 3 },
      rating: "8.7",
      year: "2023",
      episode: "Tập 5",
      description: "Câu chuyện lịch sử về một cô gái nô lệ trở thành hoàng hậu quyền lực nhất trong lịch sử Joseon.",
      genres: ["Lịch sử", "Lãng mạn", "Chính trị"]
    },
    {
      title: "Yêu Lại Từ Đầu",
      img:  "https://phim.nguonc.com/public/images/Post/8/am-thuc-mien-que-cung-edward-lee.jpg",
      tags: { pd: 8, tm: 4 },
      rating: "7.8",
      year: "2023",
      episode: "Tập 8",
      description: "Một cặp đôi đã ly hôn tình cờ gặp lại nhau sau 5 năm và nhận ra tình cảm của họ chưa bao giờ phai nhạt.",
      genres: ["Lãng mạn", "Hài hước", "Tâm lý"]
    },
    {
      title: "Đặc Vụ Ngầm",
      img: "https://phim.nguonc.com/public/images/Post/2/chuyen-doi-bac-si-noi-tru.jpg",    
      tags: { pd: 10, tm: 5 },
      rating: "8.3",
      year: "2023",
      episode: "Tập 10",
      description: "Một đặc vụ tài năng được giao nhiệm vụ xâm nhập vào tổ chức buôn bán vũ khí nguy hiểm nhất châu Á.",
      genres: ["Hành Động", "Gay Cấn", "Điệp Viên"]
    }
    ,
    {
      title: "Đặc Vụ Ngầm",
      img: "https://phim.nguonc.com/public/images/Post/2/chuyen-doi-bac-si-noi-tru.jpg",    
      tags: { pd: 10, tm: 5 },
      rating: "8.3",
      year: "2023",
      episode: "Tập 10",
      description: "Một đặc vụ tài năng được giao nhiệm vụ xâm nhập vào tổ chức buôn bán vũ khí nguy hiểm nhất châu Á.",
      genres: ["Hành Động", "Gay Cấn", "Điệp Viên"]
    }
    ,
    {
      title: "Đặc Vụ Ngầm",
      img: "https://phim.nguonc.com/public/images/Post/2/chuyen-doi-bac-si-noi-tru.jpg",    
      tags: { pd: 10, tm: 5 },
      rating: "8.3",
      year: "2023",
      episode: "Tập 10",
      description: "Một đặc vụ tài năng được giao nhiệm vụ xâm nhập vào tổ chức buôn bán vũ khí nguy hiểm nhất châu Á.",
      genres: ["Hành Động", "Gay Cấn", "Điệp Viên"]
    }
    ,
    {
      title: "Đặc Vụ Ngầm",
      img: "https://phim.nguonc.com/public/images/Post/2/chuyen-doi-bac-si-noi-tru.jpg",    
      tags: { pd: 10, tm: 5 },
      rating: "8.3",
      year: "2023",
      episode: "Tập 10",
      description: "Một đặc vụ tài năng được giao nhiệm vụ xâm nhập vào tổ chức buôn bán vũ khí nguy hiểm nhất châu Á.",
      genres: ["Hành Động", "Gay Cấn", "Điệp Viên"]
    }
  ];

  // Initialize state variables
  let position = 0;
  let cardWidth = 265; // 250px width + 15px margin
  let visibleCards = 0;
  let containerWidth = 0;
  let maxPosition = 0;

  // DOM elements
  const container = document.getElementById('movie-container');
  const template = document.getElementById('movie-card-template');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const carousel = document.querySelector('.movie-carousel');
  
  // Function to render movie cards
  function renderMovies() {
    container.innerHTML = '';
    
    movies.forEach(movie => {
      const clone = document.importNode(template.content, true);
      
      // Set image and alt text
      const img = clone.querySelector('img');
      img.src = movie.img;
      img.alt = movie.title;
      
      // Set title
      clone.querySelector('.movie-info h3').textContent = movie.title;
      clone.querySelector('.movie-title').textContent = movie.title;
      
      // Set tags
      const tagsContainer = clone.querySelector('.movie-tags');
      tagsContainer.innerHTML = '';
      
      if (movie.tags.pd) {
        const pdTag = document.createElement('span');
        pdTag.className = 'tag pd-tag';
        pdTag.textContent = `PD. ${movie.tags.pd}`;
        tagsContainer.appendChild(pdTag);
      }
      
      if (movie.tags.tm) {
        const tmTag = document.createElement('span');
        tmTag.className = 'tag tm-tag';
        tmTag.textContent = `TM. ${movie.tags.tm}`;
        tagsContainer.appendChild(tmTag);
      }
      
      // Set movie details
      clone.querySelector('.imdb-rating').textContent = movie.rating;
      clone.querySelector('.movie-year').textContent = movie.year;
      clone.querySelector('.movie-episode').textContent = movie.episode;
      clone.querySelector('.movie-description').textContent = movie.description;
      
      // Set genres
      const genresContainer = clone.querySelector('.movie-genres');
      genresContainer.innerHTML = '';
      
      movie.genres.forEach(genre => {
        const genreTag = document.createElement('span');
        genreTag.className = 'genre-tag';
        genreTag.textContent = genre;
        genresContainer.appendChild(genreTag);
      });
      
      container.appendChild(clone);
    });
    
    // Setup button states and event listeners
    updateCarouselState();
    setupEventListeners();
  }
  
  // Function to update carousel dimensions and state
  function updateCarouselState() {
    // Get container width
    containerWidth = carousel.clientWidth;
    
    // Calculate how many cards can be visible at once
    visibleCards = Math.floor(containerWidth / cardWidth);
    
    // Calculate maximum scroll position
    const totalWidth = movies.length * cardWidth;
    maxPosition = Math.min(0, containerWidth - totalWidth);
    
    // Update navigation button states
    updateNavButtons();
  }
  
  // Function to update navigation button states (enabled/disabled)
  function updateNavButtons() {
    // Enable/disable prev button based on position
    prevBtn.disabled = position >= 0;
    prevBtn.style.opacity = position >= 0 ? '0.5' : '0.8';
    
    // Enable/disable next button based on position
    nextBtn.disabled = position <= maxPosition;
    nextBtn.style.opacity = position <= maxPosition ? '0.5' : '0.8';
  }
  
  // Function to setup all event listeners
  function setupEventListeners() {
    // Watch buttons
    document.querySelectorAll('.watch-btn').forEach(button => {
      button.addEventListener('click', handleWatchClick, { passive: true });
    });
    
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(button => {
      button.addEventListener('click', handleLikeClick, { passive: true });
    });
    
    // Details buttons
    document.querySelectorAll('.details-btn').forEach(button => {
      button.addEventListener('click', handleDetailsClick, { passive: true });
    });
  }
  
  // Event handlers
  function handleWatchClick(e) {
    e.stopPropagation();
    const movieTitle = e.target.closest('.modal-content').querySelector('.movie-title').textContent;
    alert(`▶️ Đang phát: ${movieTitle}`);
  }
  
  function handleLikeClick(e) {
    e.stopPropagation();
    const button = e.target;
    button.classList.toggle('active');
    button.textContent = button.classList.contains('active') ? '❤️' : '♥';
    const movieTitle = e.target.closest('.modal-content').querySelector('.movie-title').textContent;
    alert(`${button.classList.contains('active') ? 'Đã thêm' : 'Đã xóa'} ${movieTitle} ${button.classList.contains('active') ? 'vào' : 'khỏi'} danh sách yêu thích`);
  }
  
  function handleDetailsClick(e) {
    e.stopPropagation();
    const movieTitle = e.target.closest('.modal-content').querySelector('.movie-title').textContent;
    alert(`ⓘ Chi tiết phim: ${movieTitle}`);
  }
  
  // Function to handle previous button click
  function handlePrevClick() {
    // Calculate number of cards to scroll
    const scrollCards = Math.min(3, visibleCards);
    
    // Calculate new position
    const newPosition = Math.min(0, position + (cardWidth * scrollCards));
    
    // Animate to new position if it's different
    if (newPosition !== position) {
      position = newPosition;
      container.style.transform = `translateX(${position}px)`;
      
      // Update button states
      updateNavButtons();
    }
  }
  
  // Function to handle next button click
  function handleNextClick() {
    // Calculate number of cards to scroll
    const scrollCards = Math.min(3, visibleCards);
    
    // Calculate new position
    const newPosition = Math.max(maxPosition, position - (cardWidth * scrollCards));
    
    // Animate to new position if it's different
    if (newPosition !== position) {
      position = newPosition;
      container.style.transform = `translateX(${position}px)`;
      
      // Update button states
      updateNavButtons();
    }
  }
  
  // Debounce function for resize event
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Function to handle window resize
  const handleResize = debounce(() => {
    // Update carousel state
    updateCarouselState();
    
    // Reset position if we're scrolled too far
    if (position < maxPosition) {
      position = maxPosition;
      container.style.transform = `translateX(${position}px)`;
    }
  }, 200);
  
  // Initialize the carousel
  function initCarousel() {
    // Render movies
    renderMovies();
    
    // Add event listeners for navigation
    prevBtn.addEventListener('click', handlePrevClick);
    nextBtn.addEventListener('click', handleNextClick);
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Add touch/swipe support
    if ('ontouchstart' in window) {
      let touchStartX = 0;
      let touchEndX = 0;
      
      container.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      container.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        
        // If the swipe was significant
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            // Swipe left, go next
            handleNextClick();
          } else {
            // Swipe right, go prev
            handlePrevClick();
          }
        }
      }, { passive: true });
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initCarousel);