document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('movie-video');
    const videoContainer = document.getElementById('videoContainer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const rewindBtn = document.getElementById('rewindBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const progressBar = document.getElementById('progressBar');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const pipBtn = document.getElementById('pipBtn');
    const skipIntroBtn = document.getElementById('skipIntroBtn');

    // *** REMOVED HLS.js Initialization Section ***
    // const videoSrc = "..."; // No longer needed here if set in HTML
    // let hls; // No longer needed

    let introEndTime = 30;
    let skipIntroShown = false;

    // Check if the browser can potentially play the HLS type (basic check)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log("Browser reports it might support HLS natively.");
    } else {
        console.warn("Browser does not report native HLS support. Playback likely won't work.");
        // You could display a message to the user here
        // e.g., videoContainer.innerHTML = "<p>Video playback is not supported in your browser.</p>";
    }


    // --- Helper Functions ---
    function formatTime(timeInSeconds) {
        // Check if timeInSeconds is a valid number
        if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) {
            return "00:00"; // Or some other placeholder
        }
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // --- Event Listeners (These remain largely the same) ---

    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (video.paused || video.ended) {
            video.play().catch(error => console.error("Play Error:", error)); // Added catch
        } else {
            video.pause();
        }
    });

    video.addEventListener('play', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    video.addEventListener('pause', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    // Rewind / Forward
    rewindBtn.addEventListener('click', () => {
        video.currentTime = Math.max(0, video.currentTime - 10); // Prevent going below 0
    });

    forwardBtn.addEventListener('click', () => {
        if(video.duration && isFinite(video.duration)) { // Only add if duration is known
            video.currentTime = Math.min(video.duration, video.currentTime + 10); // Prevent going past duration
        } else {
            video.currentTime += 10; // Allow seeking even if duration unknown (might be live)
        }
    });

    // Volume Control
    volumeBtn.addEventListener('click', () => {
        video.muted = !video.muted;
    });

    video.addEventListener('volumechange', () => {
        volumeSlider.value = video.volume;
        if (video.muted || video.volume === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeSlider.value = 0;
        } else if (video.volume < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-low"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
        }
    });

    volumeSlider.addEventListener('input', () => {
        video.volume = volumeSlider.value;
        video.muted = volumeSlider.value == 0;
    });

    // Progress Bar & Time Display
     video.addEventListener('loadedmetadata', () => {
         // It's crucial HLS provides duration metadata for this to work correctly natively
         if (video.duration && isFinite(video.duration)) {
             durationDisplay.textContent = formatTime(video.duration);
             progressBar.max = video.duration;
         } else {
             // This often happens with live HLS streams or if metadata fails
             console.warn("Video duration is not available or infinite (potentially live stream). Progress bar seeking might be limited.");
             durationDisplay.textContent = "??:??"; // Indicate unknown duration
             // Disable progress bar or handle differently for live streams
             // progressBar.disabled = true; // Example: Disable seeking
         }
     });

    video.addEventListener('timeupdate', () => {
        const currentTime = video.currentTime;
        currentTimeDisplay.textContent = formatTime(currentTime);

        // Update progress bar ONLY if duration is valid and finite
        // Avoid setting value if max is not properly set (e.g., for live streams)
        if(video.duration && isFinite(video.duration)) {
            progressBar.value = currentTime;
        } else {
            // If live or duration unknown, maybe don't update progress bar value
             progressBar.value = 0; // Or keep it static
        }


        // Show/Hide Skip Intro Button
        if (currentTime < introEndTime && !skipIntroShown) {
            skipIntroBtn.style.display = 'block';
        } else {
            // Hide if time is past intro OR if it was already skipped
            if (currentTime >= introEndTime || skipIntroShown) {
                skipIntroBtn.style.display = 'none';
            }
        }
    });

    // Seeking with Progress Bar
    progressBar.addEventListener('input', () => {
        // Only allow seeking if duration is known and finite
        if(video.duration && isFinite(video.duration)){
             video.currentTime = progressBar.value;
        } else {
            console.warn("Seeking disabled: Video duration unknown or infinite.");
        }
    });


    // Skip Intro
    skipIntroBtn.addEventListener('click', () => {
         // Only seek if duration is known or we assume it's safe to seek
         if (video.duration && isFinite(video.duration) || video.seekable.length > 0) {
            video.currentTime = introEndTime;
            skipIntroShown = true;
            skipIntroBtn.style.display = 'none';
         }
    });

    // Fullscreen (Remains the same)
    fullscreenBtn.addEventListener('click', () => {
        // ... (fullscreen code is unchanged) ...
    });
    document.addEventListener('fullscreenchange', () => {
        // ... (fullscreen icon update is unchanged) ...
    });

    // Picture-in-Picture (Remains the same)
    pipBtn.addEventListener('click', () => {
         // ... (PiP code is unchanged) ...
    });
     video.addEventListener('enterpictureinpicture', () => {
         // ... (PiP icon update is unchanged) ...
     });
     video.addEventListener('leavepictureinpicture', () => {
         // ... (PiP icon update is unchanged) ...
     });

    // Add listener for when the video can actually start playing
    video.addEventListener('canplay', () => {
        console.log("Video reports 'canplay'");
        // Maybe enable controls here if they were initially disabled
    });

    // Add listener for video errors
    video.addEventListener('error', (e) => {
        console.error("Video Error:", video.error);
        // Display a user-friendly error message
        let errorMessage = "An error occurred while trying to play the video.";
        if (video.error) {
            switch (video.error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    errorMessage = 'Video playback aborted.';
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    errorMessage = 'A network error caused the video download to fail.';
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    errorMessage = 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.';
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage = 'The video could not be loaded, either because the server or network failed or because the format is not supported.';
                    break;
                default:
                    errorMessage = 'An unknown error occurred.';
                    break;
            }
        }
         // Example: Display error inside the video container
         videoContainer.style.display = 'flex';
         videoContainer.style.alignItems = 'center';
         videoContainer.style.justifyContent = 'center';
         videoContainer.innerHTML = `<p style="color: red; padding: 20px;">${errorMessage}</p>`;
    });


}); // End DOMContentLoaded