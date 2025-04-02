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