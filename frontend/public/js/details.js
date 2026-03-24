document.addEventListener('DOMContentLoaded', async function() {
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
    
    const urlParams = new URLSearchParams(window.location.search);
    const gameName = urlParams.get('game');
    const gameId = urlParams.get('id');
    
    if (gameName) {
        const headerElement = document.querySelector('.details-header h1');
        if (headerElement) {
            headerElement.textContent = `${gameName.toUpperCase()} DETAILS`;
        }
    }
    
    if (gameId) {
        const gameDetails = await getGameDetails(gameId);
        
        if (gameDetails) {
            const titleElement = document.querySelector('.game-title-large h2');
            const ratingElement = document.querySelector('.rating-large');
            const infoStats = document.querySelector('.info-stats');
            const extraDetails = document.querySelector('.extra-details');
            const trailerVideo = document.getElementById('trailerVideo');
            
            if (titleElement) titleElement.textContent = gameDetails.name;
            if (ratingElement) ratingElement.textContent = `★${gameDetails.rating}`;
            
            if (infoStats) {
                const genres = gameDetails.genres.slice(0, 2).join(', ');
                infoStats.innerHTML = `
                    <div class="stat-badge"><span>${genres || 'Game'}</span></div>
                    <div class="stat-badge"><i class="fas fa-star"></i> ${gameDetails.rating_count || '0'} ratings</div>
                    <div class="stat-badge">★${gameDetails.rating}</div>
                    <div class="stat-badge"><i class="fas fa-calendar"></i> ${gameDetails.released || '2024'}</div>
                    <div class="stat-badge"><i class="fas fa-clock"></i> ${gameDetails.playtime || 'N/A'} hrs</div>
                `;
            }
            
            if (extraDetails) {
                extraDetails.innerHTML = `
                    <p><i class="fas fa-tag"></i> Genre: ${gameDetails.genres.join(', ')}</p>
                    <p><i class="fas fa-calendar"></i> Release: ${gameDetails.released || '2024'}</p>
                    <p><i class="fas fa-globe"></i> Platform: ${gameDetails.platforms.slice(0, 3).join(', ')}</p>
                    <p><i class="fas fa-building"></i> Developer: ${gameDetails.developers.join(', ') || 'Various'}</p>
                    <p><i class="fas fa-chart-line"></i> Metacritic: ${gameDetails.metacritic || 'N/A'}</p>
                    <p><i class="fas fa-info-circle"></i> ${gameDetails.description.substring(0, 200)}${gameDetails.description.length > 200 ? '...' : ''}</p>
                `;
            }
            
            if (trailerVideo && gameDetails.background_image) {
                trailerVideo.style.backgroundImage = `url(${gameDetails.background_image})`;
                trailerVideo.style.backgroundSize = 'cover';
                trailerVideo.style.backgroundPosition = 'center';
                trailerVideo.style.position = 'relative';
                trailerVideo.style.cursor = 'pointer';
                
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.right = '0';
                overlay.style.bottom = '0';
                overlay.style.background = 'rgba(0,0,0,0.5)';
                overlay.style.borderRadius = '16px';
                trailerVideo.appendChild(overlay);
            }
        }
    }
    
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
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(gameName + ' trailer')}`, '_blank');
        });
    }
    
    const watchBtn = document.getElementById('watchTrailerBtn');
    if (watchBtn) {
        watchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(gameName + ' trailer')}`, '_blank');
        });
    }
    
    const downloadBtn = document.getElementById('downloadNowBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(`https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`, '_blank');
        });
    }
    
    const suggestCards = document.querySelectorAll('.suggest-card');
    suggestCards.forEach(card => {
        card.addEventListener('click', async function() {
            const gameName = this.getAttribute('data-game') || this.querySelector('span:first-of-type').textContent;
            const searchResults = await searchGames(gameName, 1);
            if (searchResults && searchResults[0]) {
                window.location.href = `details.html?game=${encodeURIComponent(gameName)}&id=${searchResults[0].id}`;
            } else {
                window.location.href = `details.html?game=${encodeURIComponent(gameName)}`;
            }
        });
    });
    
    const footer = document.querySelector('.cyborg-footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = `Copyright @ ${year} Cyborg Gaming Company. All rights reserved. Design: TemplateMo`;
    }
});