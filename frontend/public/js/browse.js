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
    
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.innerHTML = `⚡ Welcome back, ${username}`;
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
    
    async function fetchGamesByPlatform(platformId, limit = 6) {
        try {
            const response = await fetch(`http://localhost:3000/api/games?platform=${platformId}&page_size=${limit}`);
            const data = await response.json();
            return data.success ? data.games : [];
        } catch (error) {
            console.error('Error fetching games:', error);
            return [];
        }
    }
    
    async function fetchGamesByPlatforms(platforms, limit = 6) {
        try {
            const games = [];
            for (const platform of platforms) {
                const response = await fetch(`http://localhost:3000/api/games?platforms=${platform}&page_size=${limit}`);
                const data = await response.json();
                if (data.success && data.games) {
                    games.push(...data.games.slice(0, 2));
                }
            }
            return games.slice(0, 6);
        } catch (error) {
            console.error('Error fetching games:', error);
            return [];
        }
    }
    
    async function loadFeaturedGames() {
        const featuredGrid = document.querySelector('.featured-grid');
        if (!featuredGrid) return;
        
        featuredGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#c9a6ff;">Loading featured games...</div>';
        
        try {
            const response = await fetch('http://localhost:3000/api/popular-games');
            const data = await response.json();
            
            if (data.success && data.games && data.games.length > 0) {
                featuredGrid.innerHTML = '';
                
                data.games.slice(0, 6).forEach(game => {
                    const card = document.createElement('div');
                    card.className = 'featured-card';
                    card.setAttribute('data-game', game.name);
                    card.setAttribute('data-id', game.id);
                    card.setAttribute('data-description', game.description_raw || 'No description available');
                    
                    const platforms = game.platforms ? game.platforms.map(p => p.platform.name).slice(0, 2).join(', ') : 'PC';
                    
                    card.innerHTML = `
                        <div class="feat-icon">
                            ${game.background_image ? 
                                `<img src="${game.background_image}" style="width:60px;height:60px;border-radius:12px;object-fit:cover;">` : 
                                `<i class="fas fa-gamepad"></i>`
                            }
                        </div>
                        <div>
                            <h3>${game.name.length > 18 ? game.name.substring(0, 18) + '...' : game.name} <span class="game-cat">${platforms}</span></h3>
                            <div class="rating-downloads">★ ${game.rating ? game.rating.toFixed(1) : '4.5'} <span>⭐ ${game.ratings_count || 0}</span></div>
                        </div>
                        <div class="game-tooltip">${(game.description_raw || 'No description available').substring(0, 150)}${(game.description_raw || '').length > 150 ? '...' : ''}</div>
                    `;
                    
                    const style = document.createElement('style');
                    style.textContent = `
                        .featured-card {
                            position: relative;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        }
                        .game-tooltip {
                            position: absolute;
                            bottom: 100%;
                            left: 0;
                            right: 0;
                            background: #2a2540;
                            border: 1px solid #8a67b5;
                            border-radius: 12px;
                            padding: 12px;
                            font-size: 0.85rem;
                            color: #f0eaff;
                            z-index: 100;
                            opacity: 0;
                            visibility: hidden;
                            transition: all 0.3s ease;
                            pointer-events: none;
                            margin-bottom: 10px;
                            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                            max-width: 280px;
                        }
                        .featured-card:hover .game-tooltip {
                            opacity: 1;
                            visibility: visible;
                            transform: translateY(-5px);
                        }
                    `;
                    document.head.appendChild(style);
                    
                    card.addEventListener('click', () => {
                        window.location.href = `details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                    });
                    
                    featuredGrid.appendChild(card);
                });
            } else {
                featuredGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#ff8a8a;">No games found.</div>';
            }
        } catch (error) {
            console.error('Error loading featured games:', error);
            featuredGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#ff8a8a;">Failed to load games. Make sure backend is running.</div>';
        }
    }
    
    async function loadMiniGames() {
        const miniGamesRow = document.querySelector('.mini-games-row');
        if (!miniGamesRow) return;
        
        miniGamesRow.innerHTML = '<div style="text-align:center; padding:2rem; color:#c9a6ff; width:100%;">Loading games...</div>';
        
        try {
            const response = await fetch('http://localhost:3000/api/popular-games');
            const data = await response.json();
            
            if (data.success && data.games && data.games.length > 0) {
                miniGamesRow.innerHTML = '';
                
                data.games.slice(0, 3).forEach(game => {
                    const gameItem = document.createElement('div');
                    gameItem.className = 'mini-game-item';
                    gameItem.setAttribute('data-game', game.name);
                    gameItem.setAttribute('data-id', game.id);
                    gameItem.setAttribute('data-description', game.description_raw || 'No description available');
                    
                    gameItem.innerHTML = `
                        ${game.background_image ? 
                            `<img src="${game.background_image}" style="width:45px;height:45px;border-radius:10px;object-fit:cover;">` : 
                            `<i class="fas fa-gamepad"></i>`
                        }
                        <div class="mini-details">
                            <span class="mini-title">${game.name.length > 12 ? game.name.substring(0, 12) + '...' : game.name}</span>
                            <span class="mini-rating">★ ${game.rating ? game.rating.toFixed(1) : '4.5'}</span>
                        </div>
                        <div class="mini-dl">${game.released ? game.released.split('-')[0] : '2024'} <i class="fas fa-calendar"></i></div>
                        <div class="mini-tooltip">${(game.description_raw || 'No description available').substring(0, 100)}${(game.description_raw || '').length > 100 ? '...' : ''}</div>
                    `;
                    
                    const miniStyle = document.createElement('style');
                    miniStyle.textContent = `
                        .mini-game-item {
                            position: relative;
                            cursor: pointer;
                        }
                        .mini-tooltip {
                            position: absolute;
                            bottom: 100%;
                            left: 0;
                            background: #2a2540;
                            border: 1px solid #8a67b5;
                            border-radius: 8px;
                            padding: 8px 12px;
                            font-size: 0.75rem;
                            color: #f0eaff;
                            z-index: 100;
                            opacity: 0;
                            visibility: hidden;
                            transition: all 0.3s ease;
                            pointer-events: none;
                            margin-bottom: 8px;
                            white-space: normal;
                            width: 200px;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        }
                        .mini-game-item:hover .mini-tooltip {
                            opacity: 1;
                            visibility: visible;
                            transform: translateY(-3px);
                        }
                    `;
                    document.head.appendChild(miniStyle);
                    
                    gameItem.addEventListener('click', () => {
                        window.location.href = `details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                    });
                    
                    miniGamesRow.appendChild(gameItem);
                });
            }
        } catch (error) {
            console.error('Error loading mini games:', error);
            miniGamesRow.innerHTML = '<div style="text-align:center; padding:2rem; color:#ff8a8a; width:100%;">Failed to load games</div>';
        }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const viewAll = urlParams.get('view');
    const searchQuery = urlParams.get('search');
    
    if (viewAll === 'all' || searchQuery) {
        const featuredHeader = document.querySelector('.featured-header h2');
        const featuredGrid = document.querySelector('.featured-grid');
        
        if (searchQuery) {
            if (featuredHeader) featuredHeader.innerHTML = `Search Results for "${searchQuery}"`;
            
            try {
                const response = await fetch(`http://localhost:3000/api/games/search/${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                
                if (featuredGrid && data.success && data.games) {
                    featuredGrid.innerHTML = '';
                    featuredGrid.style.display = 'grid';
                    featuredGrid.style.maxHeight = '600px';
                    featuredGrid.style.overflowY = 'auto';
                    featuredGrid.style.padding = '10px';
                    
                    data.games.forEach(game => {
                        const card = document.createElement('div');
                        card.className = 'featured-card';
                        card.setAttribute('data-game', game.name);
                        card.setAttribute('data-id', game.id);
                        card.setAttribute('data-description', game.description_raw || 'No description available');
                        
                        card.innerHTML = `
                            <div class="feat-icon">
                                ${game.background_image ? 
                                    `<img src="${game.background_image}" style="width:50px;height:50px;border-radius:12px;object-fit:cover;">` : 
                                    `<i class="fas fa-gamepad"></i>`
                                }
                            </div>
                            <div>
                                <h3>${game.name.length > 20 ? game.name.substring(0, 20) + '...' : game.name} <span class="game-cat">${game.released ? game.released.split('-')[0] : '2024'}</span></h3>
                                <div class="rating-downloads">★ ${game.rating ? game.rating.toFixed(1) : '4.5'} <span>⭐ ${game.ratings_count || 0}</span></div>
                            </div>
                            <div class="game-tooltip">${(game.description_raw || 'No description available').substring(0, 150)}</div>
                        `;
                        
                        card.addEventListener('click', () => {
                            window.location.href = `details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                        });
                        
                        featuredGrid.appendChild(card);
                    });
                }
            } catch (error) {
                console.error('Error searching games:', error);
            }
        } else {
            if (featuredHeader) featuredHeader.innerHTML = 'All Games <span class="sub-header">browse our complete collection</span>';
            
            try {
                const response = await fetch('http://localhost:3000/api/popular-games');
                const data = await response.json();
                
                if (featuredGrid && data.success && data.games) {
                    featuredGrid.innerHTML = '';
                    featuredGrid.style.display = 'grid';
                    featuredGrid.style.maxHeight = '600px';
                    featuredGrid.style.overflowY = 'auto';
                    featuredGrid.style.padding = '10px';
                    
                    const allGames = [...data.games];
                    for (let i = 0; i < 20; i++) {
                        allGames.push(...data.games);
                    }
                    
                    allGames.slice(0, 30).forEach(game => {
                        const card = document.createElement('div');
                        card.className = 'featured-card';
                        card.setAttribute('data-game', game.name);
                        card.setAttribute('data-id', game.id);
                        
                        card.innerHTML = `
                            <div class="feat-icon">
                                ${game.background_image ? 
                                    `<img src="${game.background_image}" style="width:50px;height:50px;border-radius:12px;object-fit:cover;">` : 
                                    `<i class="fas fa-gamepad"></i>`
                                }
                            </div>
                            <div>
                                <h3>${game.name.length > 20 ? game.name.substring(0, 20) + '...' : game.name} <span class="game-cat">${game.released ? game.released.split('-')[0] : '2024'}</span></h3>
                                <div class="rating-downloads">★ ${game.rating ? game.rating.toFixed(1) : '4.5'} <span>⭐ ${game.ratings_count || 0}</span></div>
                            </div>
                            <div class="game-tooltip">${(game.description_raw || 'No description available').substring(0, 150)}</div>
                        `;
                        
                        card.addEventListener('click', () => {
                            window.location.href = `details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                        });
                        
                        featuredGrid.appendChild(card);
                    });
                }
            } catch (error) {
                console.error('Error loading all games:', error);
            }
        }
    } else {
        await loadFeaturedGames();
        await loadMiniGames();
    }
    
    const viewAllLink = document.querySelector('.view-all-link');
    if (viewAllLink) {
        viewAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'browse.html?view=all';
        });
    }
    
    const viewAllStreams = document.querySelector('.view-all');
    if (viewAllStreams) {
        viewAllStreams.addEventListener('click', function() {
            window.location.href = 'streams.html';
        });
    }
    
    const goToProfile = document.getElementById('goToProfile');
    if (goToProfile) {
        goToProfile.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }
    
    const liveStreamBtn = document.getElementById('liveStreamBtn');
    if (liveStreamBtn) {
        liveStreamBtn.addEventListener('click', function() {
            alert('Live stream feature coming soon!');
        });
    }
    
    const liveCards = document.querySelectorAll('.live-card');
    liveCards.forEach(card => {
        card.addEventListener('click', function() {
            const streamer = this.getAttribute('data-streamer');
            window.location.href = `streams.html?streamer=${encodeURIComponent(streamer)}`;
        });
    });
    
    const discoverBtn = document.querySelector('.discover-btn');
    if (discoverBtn) {
        discoverBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'streams.html';
        });
    }
    
    const footer = document.querySelector('.cyborg-footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = `Copyright @ ${year} Cyborg Gaming Company. All rights reserved. Design: TemplateMo`;
    }
});