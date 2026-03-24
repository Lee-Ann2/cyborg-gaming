const userJson = localStorage.getItem('cyborg_current_user');

if (!userJson) {
    window.location.href = '../form/signin.html';
} else {
    const user = JSON.parse(userJson);
    const username = user.username || user.gamertag;
    
    document.getElementById('navUsername').innerText = username;
    document.querySelector('.welcome-tag').innerHTML = `Welcome back, ${username}!`;
    document.querySelector('.foot-note').innerHTML = `© ${new Date().getFullYear()} CYBORG • Welcome ${username}`;
}

document.getElementById('profileBtn')?.addEventListener('click', function(e) {
    e.stopPropagation();
    let dropdown = document.getElementById('profileDropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'profileDropdown';
        dropdown.className = 'profile-dropdown';
        dropdown.innerHTML = `
            <a href="profile.html"><i class="fas fa-user"></i> My Profile</a>
            <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
        `;
        this.appendChild(dropdown);
        document.getElementById('logoutBtn').onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('cyborg_current_user');
            localStorage.removeItem('cyborg_token');
            window.location.href = '../index.html';
        };
    }
    dropdown.classList.toggle('show');
});

document.addEventListener('click', () => {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.remove('show');
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

document.getElementById('libraryViewBtn')?.addEventListener('click', () => {
    window.location.href = 'profile.html';
});