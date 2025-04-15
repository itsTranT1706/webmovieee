// JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function () {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Episode click event
    const episodes = document.querySelectorAll('.episode');

    episodes.forEach(episode => {
        episode.addEventListener('click', function () {
            alert('Loading episode: ' + this.querySelector('.episode-number').textContent);
        });
    });

    // Toggle switch functionality
    const toggleSwitch = document.querySelector('.toggle-switch input');
    const episodesGrid = document.querySelector('.episodes-grid');

    toggleSwitch.addEventListener('change', function () {
        if (this.checked) {
            episodesGrid.style.display = 'grid';
        } else {
            episodesGrid.style.display = 'none';
        }
    });

    // Watch now button
    const watchButton = document.querySelector('.btn-primary');

    watchButton.addEventListener('click', function () {
        // alert('Starting playback of The Potato Lab');

        //DEMOOO
        window.location = "/pages/watch.html";

    });

    // Other buttons functionality
    const secondaryButtons = document.querySelectorAll('.btn-secondary');

    secondaryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const action = this.textContent.trim();
            alert(`Action: ${action}`);
        });
    });
});



// const watch = document.querySelector("#xem-ngay");
// watch.addEventListener("click", ()=>{
//     window.location = "/pages/watch.html";
// })

async function fetchData(url){
    try {
        const response = await fetch(url);
        return await response.json();
      } catch (err) {
        console.error("Fetch error:", err);
        return null;
      }
}

async function renderDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const param1 = window.location.search.match(/\?([^=]*)=/)?.[1] || "";
    const param2 = urlParams.get(param1) || "";
    const apiBase = `https://phim.nguonc.com/api/film/${param2}`;
    console.log(apiBase);
    const data = await fetchData(apiBase);
    const movieDetail = data.movie;
    console.log(movieDetail);

    const heroBack = document.querySelector(".hero-container");
    const img = heroBack.querySelector("img");
    console.log(img);
    img.src = movieDetail.poster_url;

    const content = document.querySelector(".movie-info");
    console.log(content);
    const contentHTML = `
    <div class="poster">
                <img src="${movieDetail.thumb_url}" alt="Movie poster">
            </div>
            
            <div class="details">
                <h1 class="title">${movieDetail.name}</h1>
                <h2 class="english-title">${movieDetail.original_name}</h2>
                
                <div class="info-row">
                    <div class="info-item">
                        <i class="fas fa-star"></i>
                        <span>${movieDetail.quality}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${movieDetail.category["3"]["list"][0]["name"]}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-film"></i>
                        <span>${movieDetail.time}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-list"></i>
                        <span>${movieDetail.current_episode}</span>
                    </div>
                </div>
                `;

    const cateHTML = ` <div class="genre-tags">` + movieDetail.category["2"]["list"].map((cate) => {
        return `<span class="tag">${cate.name}</span>`;
    }).join("") + `</div>`;

    // console.log(contentHTML);

    let current_episode = "";

    if (movieDetail.category["1"]["list"][0]["name"] == "Phim bộ") {
        current_episode = ` <div class="info-item">
                    <i class="fas fa-play-circle"></i>
                    <span> ${movieDetail.current_episode} / ${movieDetail.total_episodes} </span>
                </div>`;
    }
    else {
        current_episode = `<div class="info-item">
                    <i class="fas fa-play-circle"></i>
                    <span> ${movieDetail.current_episode} </span>
                </div>`;
    }
     console.log(current_episode);
    const control = `<div class="action-buttons">
                    <button class="btn btn-primary" id= "xem-ngay">
                        <i class="fas fa-play"></i>
                        Xem Ngay
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-heart"></i>
                        Yêu thích
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-plus"></i>
                        Thêm vào
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-share"></i>
                        Chia sẻ
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-comment"></i>
                        Bình luận
                    </button>
                </div>
            </div>
            
            <div class="rating-display">
                <div class="rating">8.0</div>
                <div style="text-align: center; margin-top: 5px; font-size: 12px;">Đánh giá</div>
            </div>
        </div>        
    `;
    content.innerHTML = contentHTML+cateHTML+current_episode+control;

    //demo
    const watch = document.querySelector("#xem-ngay");
    watch.addEventListener("click", ()=>{
        window.location = "/pages/watch.html";
        
    })

}
document.addEventListener("DOMContentLoaded", renderDetail());
