document.addEventListener('DOMContentLoaded', function() {
    
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(nav => nav.classList.remove('active-nav'));
            this.classList.add('active-nav');
        });
    });
    
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            window.location.href = '/frontend/public/profile.html';
        });
    }
    
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('click', function(e) {
            const query = prompt('Search for a game:');
            if (query) {
                window.location.href = `/frontend/public/browse.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
    
    const searchSpan = document.querySelector('.search-bar span');
    if (searchSpan) {
        searchSpan.addEventListener('click', function(e) {
            e.stopPropagation();
            const query = prompt('Search for a game:');
            if (query) {
                window.location.href = `/frontend/public/browse.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
    
    const trailer = document.getElementById('trailerVideo');
    if (trailer) {
        trailer.addEventListener('click', function() {
            window.open('https://www.youtube.com/watch?v=fortnite', '_blank');
        });
    }
    
    const watchBtn = document.getElementById('watchTrailerBtn');
    if (watchBtn) {
        watchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://www.youtube.com/watch?v=fortnite', '_blank');
        });
    }
    
    const downloadBtn = document.getElementById('downloadNowBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Download started! Check your downloads folder.');
        });
    }
    
    const suggestCards = document.querySelectorAll('.suggest-card');
    suggestCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameName = this.getAttribute('data-game') || this.querySelector('span:first-of-type').textContent;
            window.location.href = `/frontend/public/details.html?game=${encodeURIComponent(gameName)}`;
        });
    });
    
    const statBadges = document.querySelectorAll('.stat-badge');
    statBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#4e3d7a';
        });
        badge.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    const extraDetails = document.querySelector('.extra-details');
    if (extraDetails) {
        extraDetails.addEventListener('mouseenter', function() {
            this.style.borderColor = '#e7b9ff';
        });
        extraDetails.addEventListener('mouseleave', function() {
            this.style.borderColor = '#9a75d0';
        });
    }
    
    const footer = document.querySelector('.cyborg-footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = `Copyright @ ${year} Cyborg Gaming Company. All rights reserved. Design: TemplateMo`;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');
    if (gameParam) {
        const titleElement = document.querySelector('.game-title-large h2');
        const headerElement = document.querySelector('.details-header h1');
        if (titleElement) {
            titleElement.textContent = gameParam;
        }
        if (headerElement) {
            headerElement.textContent = `${gameParam.toUpperCase()} DETAILS`;
        }
    }
});