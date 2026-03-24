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
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        const featuredHeader = document.querySelector('.featured-header h2');
        if (featuredHeader) {
            featuredHeader.innerHTML = `Search Results for "${searchQuery}"`;
        }
        
        const searchResults = await searchGames(searchQuery, 12);
        const featuredGrid = document.querySelector('.featured-grid');
        
        if (featuredGrid && searchResults.length > 0) {
            featuredGrid.innerHTML = '';
            searchResults.forEach(game => {
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
                        <h3>${game.name.length > 20 ? game.name.substring(0, 20) + '...' : game.name} <span class="game-cat">${game.released || '2024'}</span></h3>
                        <div class="rating-downloads">★ ${game.rating} <span>⭐</span></div>
                    </div>
                `;
                
                card.addEventListener('click', () => {
                    window.location.href = `details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                });
                
                featuredGrid.appendChild(card);
            });
        } else {
            featuredGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#ff8a8a;">No games found for your search.</div>';
        }
    } else {
        const featuredGames = await getPopularGames(6);
        const featuredGrid = document.querySelector('.featured-grid');
        
        if (featuredGrid && featuredGames.length > 0) {
            featuredGrid.innerHTML = '';
            featuredGames.forEach(game => {
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
                        <h3>${game.name.length > 20 ? game.name.substring(0, 20) + '...' : game.name} <span class="game-cat">${game.genres && game.genres[0] ? game.genres[0] : 'Game'}</span></h3>
                        <div class="rating-downloads">★ ${game.rating} <span>⭐ ${game.rating_count || '0'}</span></div>
                    </div>
                `;
                
                card.addEventListener('click', () => {
                    window.location.href = `details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                });
                
                featuredGrid.appendChild(card);
            });
        }
        
        const miniGames = await getPopularGames(3);
        const miniGamesRow = document.querySelector('.mini-games-row');
        
        if (miniGamesRow && miniGames.length > 0) {
            miniGamesRow.innerHTML = '';
            miniGames.forEach(game => {
                const gameItem = document.createElement('div');
                gameItem.className = 'mini-game-item';
                gameItem.setAttribute('data-game', game.name);
                gameItem.setAttribute('data-id', game.id);
                gameItem.innerHTML = `
                    ${game.background_image ? 
                        `<img src="${game.background_image}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;">` : 
                        `<i class="fas fa-gamepad"></i>`
                    }
                    <div class="mini-details">
                        <span class="mini-title">${game.name.length > 15 ? game.name.substring(0, 15) + '...' : game.name}</span>
                        <span class="mini-rating">★${game.rating}</span>
                    </div>
                    <div class="mini-dl">${game.rating_count || '0'} <i class="fas fa-star"></i></div>
                `;
                
                gameItem.addEventListener('click', () => {
                    window.location.href = `details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                });
                
                miniGamesRow.appendChild(gameItem);
            });
        }
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
    
    const viewAllLink = document.querySelector('.view-all');
    if (viewAllLink) {
        viewAllLink.addEventListener('click', function() {
            window.location.href = 'streams.html';
        });
    }
    
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