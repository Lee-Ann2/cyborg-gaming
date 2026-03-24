document.addEventListener('DOMContentLoaded', async function() {
    const gamesGrid = document.querySelector('.games-grid');
    
    if (gamesGrid) {
        gamesGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#ff2e9f;">Loading popular games...</div>';
        
        try {
            const response = await fetch('http://localhost:3000/api/popular-games');
            const data = await response.json();
            
            if (data.success && data.games && data.games.length > 0) {
                gamesGrid.innerHTML = '';
                
                data.games.slice(0, 4).forEach(game => {
                    const gameCard = document.createElement('div');
                    gameCard.className = 'game-card';
                    gameCard.setAttribute('data-id', game.id);
                    gameCard.setAttribute('data-name', game.name);
                    gameCard.style.cursor = 'pointer';
                    
                    gameCard.innerHTML = `
                        ${game.background_image ? 
                            `<img src="${game.background_image}" alt="${game.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem;">` : 
                            `<i class="fas fa-gamepad" style="font-size: 3rem; margin-bottom: 1rem; color: #ff2e9f;"></i>`
                        }
                        <h4>${game.name.length > 15 ? game.name.substring(0, 15) + '...' : game.name}</h4>
                        <div class="game-rating">★ ${game.rating ? game.rating.toFixed(1) : '4.5'} <span style="font-size: 0.8rem;">(${game.ratings_count || 0})</span></div>
                        <div class="game-downloads">${game.released ? game.released.split('-')[0] : '2024'}</div>
                    `;
                    
                    gameCard.addEventListener('click', () => {
                        window.location.href = `/frontend/public/details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                    });
                    
                    gamesGrid.appendChild(gameCard);
                });
            } else {
                gamesGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#ff8a8a;">No games found. Check your API key.</div>';
            }
        } catch (error) {
            console.error('Error fetching games:', error);
            gamesGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#ff8a8a;">Cannot connect to server. Please start the backend server on port 3001.</div>';
        }
    }
    
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/frontend/public/browse.html?search=${encodeURIComponent(query)}`;
            } else {
                const searchResult = document.querySelector('.search-result');
                if (searchResult) {
                    searchResult.innerHTML = 'Please enter a game name';
                    searchResult.style.color = '#ff8a8a';
                    setTimeout(() => {
                        searchResult.innerHTML = '';
                    }, 2000);
                }
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `/frontend/public/browse.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
    const ctaButton = document.querySelector('.cta button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            window.location.href = '/frontend/public/form/signup.html';
        });
    }
    
    const getStartedBtn = document.querySelector('.hero .btn-primary');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/frontend/public/form/signup.html';
        });
    }
    
    const signInBtns = document.querySelectorAll('.btn-secondary');
    signInBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/frontend/public/form/signin.html';
        });
    });
    
    const signUpBtns = document.querySelectorAll('.btn-primary');
    signUpBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/frontend/public/form/signup.html';
        });
    });
    
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        const links = document.querySelectorAll('a, button');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                cursor.style.borderColor = '#ff2e9f';
                cursor.style.backgroundColor = 'rgba(255, 46, 159, 0.2)';
            });
            link.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'transparent';
            });
        });
    }
    
    const year = new Date().getFullYear();
    const footer = document.querySelector('footer p');
    if (footer) {
        footer.innerHTML = `&copy; ${year} Cyborg Gaming Platform. All rights reserved.`;
    }
});