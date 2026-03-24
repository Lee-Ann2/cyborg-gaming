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
    
    const featuredCards = document.querySelectorAll('.featured-card');
    featuredCards.forEach(card => {
        card.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            window.location.href = `details.html?game=${encodeURIComponent(game)}`;
        });
    });
    
    const miniGames = document.querySelectorAll('.mini-game-item');
    miniGames.forEach(game => {
        game.addEventListener('click', function() {
            const gameName = this.getAttribute('data-game');
            window.location.href = `details.html?game=${encodeURIComponent(gameName)}`;
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