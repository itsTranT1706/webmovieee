  // JavaScript for interactive elements
  document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Episode click event
    const episodes = document.querySelectorAll('.episode');
    
    episodes.forEach(episode => {
        episode.addEventListener('click', function() {
            alert('Loading episode: ' + this.querySelector('.episode-number').textContent);
        });
    });
    
    // Toggle switch functionality
    const toggleSwitch = document.querySelector('.toggle-switch input');
    const episodesGrid = document.querySelector('.episodes-grid');
    
    toggleSwitch.addEventListener('change', function() {
        if (this.checked) {
            episodesGrid.style.display = 'grid';
        } else {
            episodesGrid.style.display = 'none';
        }
    });
    
    // Watch now button
    const watchButton = document.querySelector('.btn-primary');
    
    watchButton.addEventListener('click', function() {
        // alert('Starting playback of The Potato Lab');
        
        //DEMOOO
        window.location = "/pages/watch.html";

    });
    
    // Other buttons functionality
    const secondaryButtons = document.querySelectorAll('.btn-secondary');
    
    secondaryButtons.forEach(button => {
        button.addEventListener('click', function() {
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
    const data = await fetchData(apiBase);
    const movieDetail = data.movie;
    console.log(movieDetail);
    const heroBackground = document.querySelector(".hero-container");
    const  img = heroBackground.querySelector("img");
    img.src = movieDetail.poster_url;

}
document.addEventListener("DOMContentLoaded", renderDetail());
