if (window.location.pathname === "/index.html") {
  console.log("Chào bạn đến với danh sách phim");
  //    await loadMovies(1);
}
if (window.location.pathname !== "/index.html") {
  const urlParams = new URLSearchParams(window.location.search);
  const param1 = window.location.search.match(/\?([^=]*)=/)?.[1] || "";
  const param2 = urlParams.get(param1) || "";
  const apiBase = `https://phim.nguonc.com/api/films/${param1}/${param2}`;

  let currentPage = 1;
  let totalPages = 1;

  const paginationElement = document.getElementById("pagination");
  const movieGridElement = document.querySelector(".movieGrid");

  async function fetchMovieData(page = 1) {
    try {
      const res = await fetch(`${apiBase}?page=${page}`);
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
      alert("Đợi xíu bạn ơii");
      return null;
    }
  }

  async function loadMovies(page = 1) {
    const data = await fetchMovieData(page);
    if (!data) return;

    if (param2 !== "") {
      document.querySelector("header").innerHTML = `<h1>${data.cat.title}</h1>`;
    }

    const html = data.items.map(movie => `
        <div class="movie-card" data-genre="drama" id="${movie.slug}">
          <img src="${movie.poster_url}" alt="${movie.name}">
          <div class="movie-info">
            <span class="rating">PD: 4</span>
            <span class="episodes">TM: 4</span>
          </div>
          <h3>${movie.name}</h3>
          <p>${movie.director}</p>
        </div>
      `).join("");

    document.querySelector("#move-list").innerHTML = html;


    const action = document.querySelectorAll(".movie-card");
    console.log(action)
    action.forEach((movie)=>{
        movie.addEventListener("click", ()=>{
          console.log(movie.id);
          window.location = `/pages/chi-tiet.html?phim=${movie.id}`;
        })
    })

    // Update pagination
    currentPage = data.paginate.current_page;
    totalPages = Math.ceil(data.paginate.total_items / data.paginate.items_per_page);
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


}
