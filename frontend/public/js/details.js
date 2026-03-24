document.addEventListener('DOMContentLoaded', function() {
    const userJson = localStorage.getItem('cyborg_current_user');
    
    if (!userJson) {
        window.location.href = '../form/signin.html';
        return;
    }
    
    const user = JSON.parse(userJson);
    const username = user.username || user.gamertag;
    
    const navUsername = document.getElementById('navUsername');
    if (navUsername) {
        navUsername.innerText = username;
    }
    
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            let logoutBtn = document.getElementById('logoutBtn');
            
            if (!logoutBtn) {
                const btn = document.createElement('button');
                btn.id = 'logoutBtn';
                btn.className = 'logout-button';
                btn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
                btn.style.position = 'absolute';
                btn.style.top = '100%';
                btn.style.right = '0';
                btn.style.marginTop = '10px';
                btn.style.background = '#2a2540';
                btn.style.border = '1px solid #8a67b5';
                btn.style.borderRadius = '8px';
                btn.style.padding = '8px 16px';
                btn.style.color = '#f0eaff';
                btn.style.cursor = 'pointer';
                btn.style.zIndex = '1000';
                btn.style.whiteSpace = 'nowrap';
                
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    localStorage.removeItem('cyborg_current_user');
                    localStorage.removeItem('cyborg_token');
                    window.location.href = '../index.html';
                });
                
                profileBtn.style.position = 'relative';
                profileBtn.appendChild(btn);
                logoutBtn = btn;
            }
            
            if (logoutBtn.style.display === 'none' || !logoutBtn.style.display) {
                logoutBtn.style.display = 'block';
            } else {
                logoutBtn.style.display = 'none';
            }
        });
    }
    
    document.addEventListener('click', function() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
    });
    
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('click', function(e) {
            const query = prompt('Search for a game:');
            if (query) {
                window.location.href = `browse.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
    
    const searchSpan = document.querySelector('.search-bar span');
    if (searchSpan) {
        searchSpan.addEventListener('click', function(e) {
            e.stopPropagation();
            const query = prompt('Search for a game:');
            if (query) {
                window.location.href = `browse.html?search=${encodeURIComponent(query)}`;
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
            window.location.href = `details.html?game=${encodeURIComponent(gameName)}`;
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