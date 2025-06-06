function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
}

const urlParams = new URLSearchParams(window.location.search);
const param1 = window.location.search.match(/\?([^=]*)=/)?.[1] || "";
const param2 = urlParams.get(param1) || "";
const apiBase = "http://localhost:8000/api/movies";
const api = param1 === "tim-kiem" ? `${apiBase}/${param1}?keyword=${param2}` : `${apiBase}/${param1}/${param2}?`;

let isExpanded = true;
let currentPage = 1;
let totalPages = 1;

const query = {
  sort_type: [],
  sort_lang: [],
  category: [],
  country: [],
  year: [],
};

function toggleFilter() {
  const filterContent = document.getElementById("filterContent");
  const filterToggle = document.getElementById("filterToggle");
  isExpanded = !isExpanded;
  filterContent.classList.toggle("expanded", isExpanded);
  filterToggle.classList.toggle("expanded", isExpanded);
  filterToggle.textContent = isExpanded ? "▼" : "▶";
}

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-option")) return;
  const section = e.target.closest(".filter-section");
  const allOption = section.querySelector(".filter-option");
  const isAllOption = e.target.textContent.includes("Tất cả");

  if (isAllOption) {
    section.querySelectorAll(".filter-option").forEach((opt) => opt.classList.remove("active"));
    e.target.classList.add("active");
  } else {
    e.target.classList.toggle("active");
    if (e.target.classList.contains("active")) allOption.classList.remove("active");
    else if (!section.querySelector(".filter-option.active:not(:first-child)")) {
      allOption.classList.add("active");
    }
  }

  applyFilters();
});

function applyFilters() {
  const activeFilters = {};
  document.querySelectorAll(".filter-section").forEach((section) => {
    const title = removeVietnameseTones(section.querySelector(".filter-section-title").textContent.replace(":", ""));
    const values = Array.from(section.querySelectorAll(".filter-option.active")).map((opt) =>
      removeVietnameseTones(opt.textContent)
    );
    activeFilters[title] = values.map((value)=> {
      if (value === "tat-ca") {
        value="";
      }
      return value
    });
    console.log(activeFilters)
  });

  const fieldMap = {
    "theo-nam" : "year",
    "moi-cap-nhat": "modified.time"
  }
  Object.assign(query, {
    sort_field: fieldMap[activeFilters["sap-xep"]] || [],
    sort_lang: activeFilters["phien-ban"] || [],
    category: activeFilters["the-loai"] || [],
    country: activeFilters["quoc-gia"] || [],
    year: activeFilters["nam-san-xuat"] || [],
  });

  const btn = document.querySelector(".btn-primary");
  const originalText = btn.textContent;
  btn.textContent = "Đang áp dụng...";
  btn.style.opacity = "0.7";

  loadMovies(1); // Reset to page 1 and fetch with new filters

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.opacity = "1";
  }, 1000);
}

function resetFilters() {
  document.querySelectorAll(".filter-section").forEach((section) => {
    section.querySelectorAll(".filter-option").forEach((opt) => opt.classList.remove("active"));
    section.querySelector(".filter-option").classList.add("active");
  });
  applyFilters();
}

function buildQueryString(query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value) && value.length) params.set(key, value.join(","));
    else if (value) params.set(key, value);
  }
  return params.toString();
}

async function fetchMovieData(query, page = 1) {
  try {
    const queryString = buildQueryString({ ...query, page });
    const res = await fetch(`${api}?${queryString}`);
    console.log(`${api}?${queryString}`)
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    console.error("Lỗi khi fetch dữ liệu:", err);
    return null;
  }
}

async function loadMovies(page = 1) {
  const data = (await fetchMovieData(query, page))?.data;
  if (!data) return;

  document.querySelector(".header").innerHTML = `<h1>${data.titlePage}</h1>`;
  const domainImg = data.APP_DOMAIN_CDN_IMAGE ? `${data.APP_DOMAIN_CDN_IMAGE}/` : "";
  document.querySelector("#move-list").innerHTML = data.items
    .map(
      (movie) => `
        <div class="movie-card" data-genre="drama" id="${movie.slug}">
          <img src="${domainImg}${movie.poster_url}" alt="${movie.name}">
          <div class="movie-info">
            <span class="rating">${movie.lang}</span>
            <span class="episodes">${movie.episode_current}</span>
          </div>
          <h3>${movie.name}</h3>
          <p>${movie.origin_name}</p>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".movie-card").forEach((movie) =>
    movie.addEventListener("click", () => (window.location = `/pages/chi-tiet.html?phim=${movie.id}`))
  );

  currentPage = data.params.pagination.currentPage;
  totalPages = data.params.pagination.totalPages;
  generatePagination();
}

function generatePagination() {
  const paginationElement = document.getElementById("pagination");
  paginationElement.innerHTML = "";

  paginationElement.appendChild(createPaginationButton("«", currentPage > 1, () => goToPage(currentPage - 1)));

  determinePageButtons().forEach((item) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    if (item === "...") {
      btn.textContent = "...";
      btn.disabled = true;
      btn.classList.add("ellipsis");
    } else {
      btn.textContent = item;
      if (currentPage === item) btn.classList.add("active");
      btn.addEventListener("click", () => goToPage(item));
      if (shouldHideOnMobile(item)) btn.classList.add("mobile-hide");
    }
    li.appendChild(btn);
    paginationElement.appendChild(li);
  });

  paginationElement.appendChild(createPaginationButton("»", currentPage < totalPages, () => goToPage(currentPage + 1)));
}

function createPaginationButton(label, enabled, handler) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.disabled = !enabled;
  if (enabled) btn.addEventListener("click", handler);
  li.appendChild(btn);
  if (label === "«" || label === "»") li.classList.add("nav-button");
  return li;
}

function determinePageButtons() {
  const buttons = [1];
  if (currentPage > 3) buttons.push("...");
  for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
    buttons.push(i);
  }
  if (currentPage < totalPages - 3) buttons.push("...");
  if (totalPages > 1) buttons.push(totalPages);
  return buttons;
}

function shouldHideOnMobile(pageNum) {
  return (
    pageNum !== 1 &&
    pageNum !== totalPages &&
    pageNum !== currentPage &&
    pageNum !== currentPage - 1 &&
    pageNum !== currentPage + 1
  );
}

async function goToPage(page) {
  await loadMovies(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Smooth scroll for filter options
document.querySelectorAll(".filter-option").forEach((option) => {
  option.addEventListener("mouseenter", () => (option.style.transform = "translateY(-2px) scale(1.02)"));
  option.addEventListener("mouseleave", () => (option.style.transform = "translateY(0) scale(1)"));
});

// Initialize
setTimeout(toggleFilter, 500);
loadMovies(currentPage);