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
    
    async function loadGameDetails(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/games/${id}`);
            const data = await response.json();
            
            if (data.success && data.game) {
                const game = data.game;
                
                const headerElement = document.querySelector('.details-header h1');
                const titleElement = document.querySelector('.game-title-large h2');
                const ratingElement = document.querySelector('.rating-large');
                const infoStats = document.querySelector('.info-stats');
                const extraDetails = document.querySelector('.extra-details');
                const trailerVideo = document.getElementById('trailerVideo');
                
                if (headerElement) headerElement.textContent = `${game.name.toUpperCase()} DETAILS`;
                if (titleElement) titleElement.textContent = game.name;
                if (ratingElement) ratingElement.textContent = `★${game.rating ? game.rating.toFixed(1) : 'N/A'}`;
                
                if (infoStats) {
                    const platforms = game.platforms ? game.platforms.slice(0, 3).map(p => p.platform.name).join(', ') : 'PC';
                    const genres = game.genres ? game.genres.slice(0, 2).map(g => g.name).join(', ') : 'Game';
                    
                    infoStats.innerHTML = `
                        <div class="stat-badge"><span>${genres}</span></div>
                        <div class="stat-badge"><i class="fas fa-star"></i> ${game.ratings_count || 0} ratings</div>
                        <div class="stat-badge">★${game.rating ? game.rating.toFixed(1) : 'N/A'}</div>
                        <div class="stat-badge"><i class="fas fa-users"></i> ${game.metacritic || 'N/A'}</div>
                        <div class="stat-badge"><i class="fas fa-hdd"></i> ${game.playtime || 'N/A'} hrs</div>
                        <div class="stat-badge"><i class="fas fa-tag"></i> ${platforms.split(',')[0] || 'PC'}</div>
                    `;
                }
                
                if (extraDetails) {
                    const platforms = game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : 'PC, Console';
                    const developers = game.developers ? game.developers.map(d => d.name).join(', ') : 'Various';
                    const publishers = game.publishers ? game.publishers.map(p => p.name).join(', ') : 'Various';
                    
                    extraDetails.innerHTML = `
                        <p><i class="fas fa-tag"></i> Genre: ${game.genres ? game.genres.map(g => g.name).join(', ') : 'Action, Adventure'}</p>
                        <p><i class="fas fa-calendar"></i> Release: ${game.released || 'TBA'}</p>
                        <p><i class="fas fa-globe"></i> Platform: ${platforms}</p>
                        <p><i class="fas fa-building"></i> Developer: ${developers}</p>
                        <p><i class="fas fa-chart-line"></i> Publisher: ${publishers}</p>
                        <p><i class="fas fa-star"></i> Metacritic: ${game.metacritic || 'N/A'}</p>
                        <p><i class="fas fa-info-circle"></i> ${game.description_raw ? game.description_raw.substring(0, 300) : 'No description available'}${game.description_raw && game.description_raw.length > 300 ? '...' : ''}</p>
                    `;
                }
                
                if (trailerVideo && game.background_image) {
                    trailerVideo.style.backgroundImage = `url(${game.background_image})`;
                    trailerVideo.style.backgroundSize = 'cover';
                    trailerVideo.style.backgroundPosition = 'center';
                    trailerVideo.style.position = 'relative';
                    trailerVideo.style.cursor = 'pointer';
                    
                    trailerVideo.innerHTML = `
                        <div class="play-overlay">
                            <i class="fas fa-play-circle" style="font-size: 4rem; color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10;"></i>
                        </div>
                    `;
                    
                    const overlay = document.createElement('div');
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.right = '0';
                    overlay.style.bottom = '0';
                    overlay.style.background = 'rgba(0,0,0,0.4)';
                    overlay.style.borderRadius = '16px';
                    trailerVideo.appendChild(overlay);
                }
                
                return game;
            }
        } catch (error) {
            console.error('Error loading game details:', error);
        }
        return null;
    }
    
    async function loadRelatedGames(genreIds, currentGameId) {
        const suggestionsContainer = document.querySelector('.mini-suggestions');
        if (!suggestionsContainer) return;
        
        suggestionsContainer.innerHTML = '<div style="text-align:center; padding:1rem; color:#c9a6ff;">Loading recommendations...</div>';
        
        try {
            let url = `http://localhost:3000/api/games?page_size=4`;
            if (genreIds && genreIds.length > 0) {
                url += `&genres=${genreIds[0]}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success && data.games) {
                const relatedGames = data.games.filter(g => g.id != currentGameId).slice(0, 4);
                
                if (relatedGames.length > 0) {
                    suggestionsContainer.innerHTML = '';
                    
                    relatedGames.forEach(game => {
                        const card = document.createElement('div');
                        card.className = 'suggest-card';
                        card.setAttribute('data-game', game.name);
                        card.setAttribute('data-id', game.id);
                        card.style.cursor = 'pointer';
                        card.style.background = '#332e45';
                        card.style.borderRadius = '12px';
                        card.style.padding = '12px';
                        card.style.display = 'flex';
                        card.style.alignItems = 'center';
                        card.style.gap = '12px';
                        card.style.transition = 'all 0.3s ease';
                        
                        card.innerHTML = `
                            ${game.background_image ? 
                                `<img src="${game.background_image}" style="width:50px;height:50px;border-radius:8px;object-fit:cover;">` : 
                                `<i class="fas fa-gamepad" style="font-size: 2rem; color: #daa5ff;"></i>`
                            }
                            <div style="flex:1;">
                                <span style="font-weight:600; color:#f0eaff;">${game.name.length > 15 ? game.name.substring(0, 15) + '...' : game.name}</span>
                                <div style="font-size:0.8rem; color:#c9a6ff;">★ ${game.rating ? game.rating.toFixed(1) : 'N/A'}</div>
                            </div>
                            <i class="fas fa-arrow-right" style="color:#daa5ff;"></i>
                        `;
                        
                        card.addEventListener('mouseenter', () => {
                            card.style.transform = 'translateX(5px)';
                            card.style.background = '#4e4080';
                        });
                        card.addEventListener('mouseleave', () => {
                            card.style.transform = 'translateX(0)';
                            card.style.background = '#332e45';
                        });
                        
                        card.addEventListener('click', () => {
                            window.location.href = `details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                        });
                        
                        suggestionsContainer.appendChild(card);
                    });
                } else {
                    suggestionsContainer.innerHTML = '<div style="text-align:center; padding:1rem; color:#c9a6ff;">More games coming soon!</div>';
                }
            }
        } catch (error) {
            console.error('Error loading related games:', error);
            suggestionsContainer.innerHTML = '<div style="text-align:center; padding:1rem; color:#c9a6ff;">Failed to load recommendations</div>';
        }
    }
    
    let currentGame = null;
    
    if (gameId) {
        currentGame = await loadGameDetails(gameId);
        if (currentGame && currentGame.genres) {
            const genreIds = currentGame.genres.map(g => g.id);
            await loadRelatedGames(genreIds, gameId);
        } else {
            await loadRelatedGames(null, gameId);
        }
    } else if (gameName) {
        try {
            const searchResponse = await fetch(`http://localhost:3000/api/games/search/${encodeURIComponent(gameName)}`);
            const searchData = await searchResponse.json();
            
            if (searchData.success && searchData.games && searchData.games.length > 0) {
                const firstGame = searchData.games[0];
                window.history.replaceState({}, '', `details.html?game=${encodeURIComponent(firstGame.name)}&id=${firstGame.id}`);
                currentGame = await loadGameDetails(firstGame.id);
                if (currentGame && currentGame.genres) {
                    const genreIds = currentGame.genres.map(g => g.id);
                    await loadRelatedGames(genreIds, firstGame.id);
                } else {
                    await loadRelatedGames(null, firstGame.id);
                }
            } else {
                document.querySelector('.extra-details').innerHTML = '<p>Game not found</p>';
                await loadRelatedGames(null, null);
            }
        } catch (error) {
            console.error('Error searching game:', error);
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
            const searchQuery = currentGame ? currentGame.name : gameName;
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' official trailer')}`, '_blank');
        });
    }
    
    const watchBtn = document.getElementById('watchTrailerBtn');
    if (watchBtn) {
        watchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const searchQuery = currentGame ? currentGame.name : gameName;
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' official trailer')}`, '_blank');
        });
    }
    
    const downloadBtn = document.getElementById('downloadNowBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const searchQuery = currentGame ? currentGame.name : gameName;
            window.open(`https://store.steampowered.com/search/?term=${encodeURIComponent(searchQuery)}`, '_blank');
        });
    }
    
    const footer = document.querySelector('.cyborg-footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = `Copyright @ ${year} Cyborg Gaming Company. All rights reserved. Design: TemplateMo`;
    }
});