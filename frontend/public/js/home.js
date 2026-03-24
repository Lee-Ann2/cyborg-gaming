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