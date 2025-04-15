document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const videoPlayer = document.getElementById('videoPlayer');
    let isPlaying = false;
    
    playPauseBtn.addEventListener('click', function() {
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
    
    // For handling embedded video
    function setupEmbeddedVideo(embedCode) {
        // This is where you would integrate your embedded video code
        // For example:
        // videoPlayer.innerHTML = embedCode;
    }
    
    // Function to handle episode selection
    const episodeItems = document.querySelectorAll('.episode-item');
    episodeItems.forEach(item => {
        item.addEventListener('click', function() {
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

async function fetchData(url){
    try {
        const response = await fetch(url);
        return await response.json();
      } catch (err) {
        console.error("Fetch error:", err);
        return null;
      }
}
async function renderWatch() {
    const urlParams = new URLSearchParams(window.location.search);
    const param1 = window.location.search.match(/\?([^=]*)=/)?.[1] || "";
    const param2 = urlParams.get(param1) || "";
    const apiBase = `https://phim.nguonc.com/api/film/${param2}`;
    console.log(apiBase);
    const data = await fetchData(apiBase);
    const movieDetail = data.movie;
    console.log(movieDetail);

    const iframe = document.querySelector("iframe");
    console.log(iframe);
    iframe.src = movieDetail.episodes[0]["items"][0]["embed"];

    const movie_title = document.querySelector(".movie-title");
    const movie_subtitle= document.querySelector(".movie-subtitle");
    movie_title.textContent = movieDetail.name;
    movie_subtitle.textContent = movieDetail.original_name;

    const meta = document.querySelector(".movie-meta");
    meta.innerHTML = `<div class="meta-item imdb">${movieDetail.quality}</div>
                    <div class="meta-item">${movieDetail.language}</div>
                    <div class="meta-item">${movieDetail.category["3"]["list"][0]["name"]}</div>
                    <div class="meta-item">${movieDetail.category["1"]["list"][0]["name"]}</div>
                    <div class="meta-item">Đã chiếu ${movieDetail.current_episode}/${movieDetail.total_episodes}</div>
                    `;
    const des = document.querySelector(".movie-description");
    des.innerHTML= movieDetail.description;
    const gens = document.querySelector(".movie-categories");
    gens.innerHTML = movieDetail.category["2"]["list"].map((cate)=>{
            return ` <div class="category">${cate.name}</div> `;
    }).join("");

    const episode = document.querySelector(".episode-grid");
    episode.innerHTML = movieDetail.episodes[0]["items"].map((episode)=>{
        return `  <div class="episode-item">
                    <div class="episode-number" id = "${episode.name}">Tập ${episode.name}</div>
                </div>`
    }).join("");

     // Function to handle episode selection
     const episodeItems = document.querySelectorAll('.episode-item');
     episodeItems.forEach(item => {
         item.addEventListener('click', function() {
             episodeItems.forEach(ep => ep.classList.remove('active'));
             this.classList.add('active');
             // Here you would load the selected episode
             const episodeNumber = this.querySelector('.episode-number').id;
             console.log(movieDetail.episodes[0]["items"][episodeNumber-1]["embed"]);
             iframe.src = movieDetail.episodes[0]["items"][episodeNumber-1]["embed"];

             // Scroll to top of player
             window.scrollTo({ top: 0, behavior: "smooth" });

         });
     });

}

document.addEventListener("DOMContentLoaded", renderWatch());