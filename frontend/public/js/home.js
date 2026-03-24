const userJson = localStorage.getItem('cyborg_current_user');

if (!userJson) {
    window.location.href = '../form/signin.html';
} else {
    const user = JSON.parse(userJson);
    const username = user.username || user.gamertag;
    
    const navUsername = document.getElementById('navUsername');
    if (navUsername) {
        navUsername.innerText = username;
    }
    
    const welcomeTag = document.querySelector('.welcome-tag');
    if (welcomeTag) {
        welcomeTag.innerHTML = `Welcome back, ${username}!`;
    }
    
    const footNote = document.querySelector('.foot-note');
    if (footNote) {
        footNote.innerHTML = `© ${new Date().getFullYear()} CYBORG • Welcome ${username}`;
    }
}

const profileBtn = document.getElementById('profileBtn');

if (profileBtn) {
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        let dropdown = document.getElementById('profileDropdown');
        
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.id = 'profileDropdown';
            dropdown.className = 'profile-dropdown';
            dropdown.innerHTML = `
                <a href="#" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
            this.appendChild(dropdown);
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    localStorage.removeItem('cyborg_current_user');
                    localStorage.removeItem('cyborg_token');
                    window.location.href = '../index.html';
                });
            }
        }
        
        dropdown.classList.toggle('show');
    });
}

document.addEventListener('click', function() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
});

async function loadPopularGames() {
    const gamesGrid = document.getElementById('popularGrid');
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#c9a6ff;">Loading popular games...</div>';
    
    try {
        const response = await fetch('http://localhost:3000/api/popular-games');
        const data = await response.json();
        
        if (data.success && data.games && data.games.length > 0) {
            gamesGrid.innerHTML = '';
            
            data.games.slice(0, 4).forEach(game => {
                const gameCard = document.createElement('div');
                gameCard.className = 'game-card';
                gameCard.setAttribute('data-game', game.name);
                gameCard.setAttribute('data-id', game.id);
                
                gameCard.innerHTML = `
                    <div class="card-icon">
                        ${game.background_image ? 
                            `<img src="${game.background_image}" style="width:60px;height:60px;border-radius:12px;object-fit:cover;">` : 
                            `<i class="fas fa-gamepad"></i>`
                        }
                    </div>
                    <h3>${game.name.length > 15 ? game.name.substring(0, 15) + '...' : game.name}</h3>
                    <div class="rating">★ ${game.rating ? game.rating.toFixed(1) : '4.5'} <span>${game.released ? game.released.split('-')[0] : '2024'}</span></div>
                    <div class="meta-info">
                        <span>${game.genres && game.genres[0] ? game.genres[0].name : 'Game'}</span>
                        <span><i class="far fa-clock"></i> ${game.ratings_count || '0'} ratings</span>
                    </div>
                `;
                
                gameCard.addEventListener('click', () => {
                    window.location.href = `details.html?game=${encodeURIComponent(game.name)}&id=${game.id}`;
                });
                
                gamesGrid.appendChild(gameCard);
            });
        } else {
            gamesGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#ff8a8a;">Failed to load games. Make sure backend is running.</div>';
        }
    } catch (error) {
        console.error('Error fetching games:', error);
        gamesGrid.innerHTML = '<div style="text-align:center; padding:2rem; color:#ff8a8a;">Cannot connect to server. Please start the backend server on port 3000.</div>';
    }
}

async function loadLibraryGames() {
    const libraryList = document.getElementById('libraryList');
    if (!libraryList) return;
    
    try {
        const response = await fetch('http://localhost:3000/api/popular-games');
        const data = await response.json();
        
        if (data.success && data.games && data.games.length > 0) {
            const games = data.games.slice(0, 3);
            const libraryItems = libraryList.querySelectorAll('.library-item');
            
            libraryItems.forEach((item, index) => {
                if (games[index]) {
                    const game = games[index];
                    const gameName = item.querySelector('.game-name');
                    const gameIcon = item.querySelector('.game-avatar i');
                    const hoursElement = item.querySelector('.lib-col:nth-child(3) strong');
                    
                    if (gameName) gameName.textContent = game.name;
                    
                    if (gameIcon && game.background_image) {
                        gameIcon.style.display = 'none';
                        const img = document.createElement('img');
                        img.src = game.background_image;
                        img.style.width = '45px';
                        img.style.height = '45px';
                        img.style.borderRadius = '8px';
                        img.style.objectFit = 'cover';
                        item.querySelector('.game-avatar').prepend(img);
                    }
                    
                    if (hoursElement) {
                        const randomHours = Math.floor(Math.random() * 500) + 100;
                        hoursElement.textContent = `${randomHours}H ${Math.floor(Math.random() * 60)}Mins`;
                    }
                    
                    item.setAttribute('data-game', game.name);
                    item.setAttribute('data-id', game.id);
                }
            });
        }
    } catch (error) {
        console.error('Error loading library games:', error);
    }
}

loadPopularGames();
loadLibraryGames();

document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const gameName = card.querySelector('h3').textContent;
        window.location.href = `details.html?game=${encodeURIComponent(gameName)}`;
    });
});

document.querySelectorAll('.library-item').forEach(item => {
    item.addEventListener('click', () => {
        const gameName = item.querySelector('.game-name').textContent;
        window.location.href = `details.html?game=${encodeURIComponent(gameName)}`;
    });
});

const libraryViewBtn = document.getElementById('libraryViewBtn');
if (libraryViewBtn) {
    libraryViewBtn.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
}