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
        alert('Starting playback of The Potato Lab');
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