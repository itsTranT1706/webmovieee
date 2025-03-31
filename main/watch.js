// Get elements
const posterOverlay = document.getElementById('posterOverlay');
const playButton = document.getElementById('playButton');

// Hide poster overlay when play button is clicked
playButton.addEventListener('click', () => {
    posterOverlay.style.display = 'none';
    // Note: We cannot programmatically play the iframe video due to cross-origin restrictions.
    // The user will need to click the play button on the external player to start the video.
});

// Optional: Add interactivity for thumbnails
const thumbnails = document.querySelectorAll('.thumbnail-list img');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        // If the streaming service allows changing the video via URL or API, you can update the iframe src here
        console.log('Thumbnail clicked:', thumbnail.alt);
        // Example: document.getElementById('movieIframe').src = "new-video-url";
    });
});