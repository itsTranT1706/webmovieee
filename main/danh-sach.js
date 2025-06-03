const urlParams = new URLSearchParams(window.location.search);
const param1 = window.location.search.match(/\?([^=]*)=/)?.[1] || "";
console.log(param1);
const param2 = urlParams.get(param1) || "";

const apiBase = `http://localhost:8000/api/movies`;
let api = ""; 
if (param1=="tim-kiem"){
   api = `${apiBase}/${param1}?keyword=${param2}`;
  console.log(api)
} 
else{
  api = `${apiBase}/${param1}/${param2}?`;
}

let currentPage = 1;
let totalPages = 1;

const paginationElement = document.getElementById("pagination");
const movieGridElement = document.querySelector(".movieGrid");

async function fetchMovieData(page = 1) {
  try {
    console.log(api)
    const res = await fetch(`${api}&page=${page}`);
    if (!res.ok) throw new Error("API error");
    // console.log("res", await res)
    // console.log("res", res.body);
    return await res.json();
  } catch (err) {
    console.error("Lỗi khi fetch dữ liệu:", err);
    // alert("Đợi xíu bạn ơii");
    return null;
  }
}

async function loadMovies(page = 1) {
  const data1 = await fetchMovieData(page);
  const data = data1.data;
  const domainImg = (data.APP_DOMAIN_CDN_IMAGE != null)? `${data.APP_DOMAIN_CDN_IMAGE}/` : "";
  if (!data) return;

  document.querySelector(".header").innerHTML = `<h1>${data.titlePage}</h1>`;

  const html = data.items.map(movie => `
        <div class="movie-card" data-genre="drama" id="${movie.slug}">
          <img src="${domainImg}${movie.poster_url}" alt="${movie.name}">
          <div class="movie-info">
            <span class="rating">${movie.lang}</span>
            <span class="episodes">${movie.episode_current}</span>
          </div>
          <h3>${movie.name}</h3>
          <p>${movie.origin_name}</p>
        </div>
      `).join("");

  document.querySelector("#move-list").innerHTML = html;


  const action = document.querySelectorAll(".movie-card");
  console.log(action)
  action.forEach((movie) => {
    movie.addEventListener("click", () => {
      console.log(movie.id);
      window.location = `/pages/chi-tiet.html?phim=${movie.id}`;
    })
  })

  // Update pagination
  currentPage = data.params.pagination.currentPage;
  totalPages = data.params.pagination.totalPages;
  generatePagination();

}

function generatePagination() {
  paginationElement.innerHTML = "";

  const prev = createPaginationButton("«", currentPage > 1, () => goToPage(currentPage - 1));
  prev.classList.add("nav-button");
  paginationElement.appendChild(prev);

  determinePageButtons().forEach(item => {
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

  const next = createPaginationButton("»", currentPage < totalPages, () => goToPage(currentPage + 1));
  next.classList.add("nav-button");
  paginationElement.appendChild(next);
}

function createPaginationButton(label, enabled, handler) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.disabled = !enabled;
  if (enabled) btn.addEventListener("click", handler);
  li.appendChild(btn);
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
  return pageNum !== 1 && pageNum !== totalPages &&
    pageNum !== currentPage &&
    pageNum !== currentPage - 1 &&
    pageNum !== currentPage + 1;
}

async function goToPage(page) {
  await loadMovies(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}


// Bắt đầu
loadMovies(currentPage);


