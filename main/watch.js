function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .trim();
}

document.addEventListener('DOMContentLoaded', function () {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const videoPlayer = document.getElementById('videoPlayer');
    let isPlaying = false;

    playPauseBtn.addEventListener('click', function () {
        if (isPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            // If this was a real video player, we would pause the video here
            console.log('Video paused');
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            // If this was a real video player, we would play the video here
            console.log('Video playing');
        }
        isPlaying = !isPlaying;
    });

    // Function to handle episode selection
    const episodeItems = document.querySelectorAll('.episode-item');
    episodeItems.forEach(item => {
        item.addEventListener('click', function () {
            episodeItems.forEach(ep => ep.classList.remove('active'));
            this.classList.add('active');
            // Here you would load the selected episode
            const episodeNumber = this.querySelector('.episode-number').textContent;
            console.log(`Loading ${episodeNumber}`);

            // Scroll to top of player
            window.scrollTo({
                top: videoPlayer.getBoundingClientRect().top + window.scrollY - 80,
                behavior: 'smooth'
            });
        });
    });

    // Add custom controls for embedded videos
    function addCustomControls() {
        // This would add custom controls overlay to embedded videos
        // For example YouTube or other providers
        console.log('Adding custom controls to embedded video');
    }
});

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}



renderWatch = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const param1 = window.location.search.match(/\?([^=]*)=/)?.[1] || "";
    const param2 = urlParams.get(param1) || "";
    const param3 = window.location.search.match(/\&\&([^=]*)=/g) || "";
    // console.log(window.location.search.match(/\&\&([^=]*)=/g));
    const param4 = urlParams.get(param3[0].match(/\&\&([^=]*)=/)[1]) || "";
    const param5 = urlParams.get(param3[1].match(/\&\&([^=]*)=/)[1]) || "";
    // console.log(param5);
    const apiBase = `http://localhost:8000/api/movies/phim/${param2}`;
    console.log(apiBase);
    const data = await fetchData(apiBase);
    const movieDetail = data.movie;
    // console.log(movieDetail);

    const poster = document.querySelector(".movie-poster");
    const img = poster.querySelector("img");
    // console.log(img);
    img.src = movieDetail.poster_url;

    const iframe = document.querySelector("iframe");
    // console.log(iframe);

    if (param4=="Full" || param4=="FULL"){
        iframe.src = data.episodes[param5]["server_data"][0]["link_embed"];
    }
    else{
        // console.log(data.episodes);
        iframe.src = param4 ? data.episodes[param5]["server_data"][param4-1]["link_embed"] : data.episodes[param5]["server_data"][0]["link_embed"];
    }

    const movie_title = document.querySelector(".movie-title");
    const movie_subtitle = document.querySelector(".movie-subtitle");
    movie_title.textContent = movieDetail.name;
    movie_subtitle.textContent = movieDetail.origin_name;
    // console.log(movieDetail.origin_name);

    const meta = document.querySelector(".movie-meta");
    meta.innerHTML = `<div class="meta-item imdb">${movieDetail.quality}</div>
                    <div class="meta-item">${movieDetail.lang}</div>
                    <div class="meta-item">${movieDetail.year}</div>
                    <div class="meta-item">${movieDetail.time}</div>
                    <div class="meta-item">Đã chiếu ${movieDetail.episode_current}</div>
                    `;
    const des = document.querySelector(".movie-description");
    des.innerHTML = movieDetail.content;
    const gens = document.querySelector(".movie-categories");
    gens.innerHTML = movieDetail.category.map((cate) => {
        return ` <a  href= "/pages/danh-sach.html?the-loai=${removeVietnameseTones(cate.name)}" class="category">${cate.name}</a> `;
    }).join("");

    // const server = document.createElement(`div`);

    const controlLang = document.querySelector(".controls-container")
    controlLang.innerHTML = data.episodes.map((server, index) => {

        return `<div class="control-btn" id ="${index}">
                        <span>${server["server_name"]}</span>
                    </div>`
    }).join("");

    // controlLang.querySelector(".control-btn").classList.add("active");
    controlLang.querySelectorAll(".control-btn")[param5].classList.add("active");
    
    controlLang.querySelectorAll(".control-btn").forEach((controlBtn) => {
        controlBtn.addEventListener("click", () => {
            controlLang.querySelectorAll(".control-btn").forEach(ep => ep.classList.remove('active'));
            controlBtn.classList.add("active");
            
            const episode = document.querySelector(".episode-grid");
            episode.innerHTML = data.episodes[controlBtn.id]["server_data"].map((episode, index) => {
                return `  <div class="episode-item">
                <div class="episode-number" id = "${index}">${episode.name}</div>
                </div>`
            }).join("");
            
    const episodes = document.querySelectorAll('.episode-item');
    episodes.forEach(episode => {
        episode.addEventListener('click', function () {
            console.log(episode);
            this.classList.add('active');
            const episodeNumber = parseInt(this.querySelector('.episode-number').id);
            console.log(episodeNumber);
            iframe.src = movieDetail.episodes[controlBtn.id]["server_data"][episodeNumber || 0 ]["link_embed"];
            window.scrollTo({ top: 0, behavior: "smooth" });

        });
    });
        })
    })

    const episode = document.querySelector(".episode-grid");
    episode.innerHTML = data.episodes[0]["server_data"].map((episode, index) => {
        return `  <div class="episode-item">
                    <div class="episode-number" id = "${index}">${episode.name}</div>
                </div>`
    }).join("");

    // Function to handle episode selection
    const episodeItems = document.querySelectorAll('.episode-item');
    episodeItems[param4-1||0].classList.add("active");
    episodeItems.forEach(item => {
        item.addEventListener('click', function () {
            episodeItems.forEach(ep => ep.classList.remove('active'));
            this.classList.add('active');
            // Here you would load the selected episode
            const episodeNumber = this.querySelector('.episode-number').id;
            // console.log(data.episodes[0]["server_data"][episodeNumber]["link_embed"]);
            iframe.src = data.episodes[0]["server_data"][episodeNumber]["link_embed"];

            // Scroll to top of player
            window.scrollTo({ top: 0, behavior: "smooth" });

        });
    });

}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    header.classList.toggle('scrolled', window.scrollY > 50);
  });


document.addEventListener("DOMContentLoaded", renderWatch());