document.addEventListener('DOMContentLoaded', function() {
    
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(nav => nav.classList.remove('active-nav'));
            this.classList.add('active-nav');
        });
    });
    
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            window.location.href = '/frontend/public/profile.html';
        });
    }
    
    const followBtns = document.querySelectorAll('.follow-btn');
    
    followBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const streamer = this.closest('.streamer-follow-card').querySelector('span').textContent;
            
            if (this.classList.contains('following')) {
                this.innerHTML = '<i class="fas fa-plus"></i> Follow';
                this.classList.remove('following');
                this.style.background = '#3f3170';
            } else {
                this.innerHTML = '<i class="fas fa-check"></i> Following';
                this.classList.add('following');
                this.style.background = '#7b4fc0';
            }
        });
    });
    
    const liveCards = document.querySelectorAll('.live-card');
    
    liveCards.forEach(card => {
        card.addEventListener('click', function() {
            const streamer = this.getAttribute('data-streamer') || this.querySelector('h3').textContent;
            window.location.href = `/frontend/public/streams.html?streamer=${encodeURIComponent(streamer)}`;
        });
    });
    
    const miniItems = document.querySelectorAll('.mini-game-item');
    
    miniItems.forEach(item => {
        item.addEventListener('click', function() {
            const game = this.getAttribute('data-game') || this.querySelector('.mini-title').textContent;
            window.location.href = `/frontend/public/details.html?game=${encodeURIComponent(game)}`;
        });
    });
    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let extraLoaded = false;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            if (!extraLoaded) {
                const liveGrid = document.getElementById('liveStreamGrid');
                
                for (let i = 0; i < 4; i++) {
                    const newCard = document.createElement('div');
                    newCard.className = 'live-card';
                    newCard.setAttribute('data-streamer', `Streamer${i+9}`);
                    newCard.innerHTML = `
                        <div class="live-avatar"><i class="fas fa-user-robot"></i></div>
                        <div class="live-info">
                            <h3>Streamer ${i+9}</h3>
                            <p class="live-tag"><i class="fas fa-circle"></i> Live Now</p>
                        </div>
                        <span class="game-label">New Stream</span>
                    `;
                    liveGrid.appendChild(newCard);
                    
                    newCard.addEventListener('click', function() {
                        const streamer = this.getAttribute('data-streamer');
                        window.location.href = `/frontend/public/streams.html?streamer=${encodeURIComponent(streamer)}`;
                    });
                }
                
                extraLoaded = true;
                loadMoreBtn.innerHTML = '<i class="fas fa-check-circle"></i> Loaded!';
                loadMoreBtn.disabled = true;
                loadMoreBtn.style.opacity = '0.7';
                loadMoreBtn.style.cursor = 'default';
            }
        });
    }
    
    const streamerCards = document.querySelectorAll('.streamer-follow-card');
    
    streamerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#4e3d7a';
        });
        card.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    const viewAll = document.querySelector('.view-all');
    if (viewAll) {
        viewAll.addEventListener('click', function() {
            window.location.href = '/frontend/public/streams.html?trending=true';
        });
    }
    
    const footer = document.querySelector('.cyborg-footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = `Copyright @ ${year} Cyborg Gaming Company. All rights reserved. Design: TemplateMo`;
    }
    
    liveCards.forEach(card => {
        card.addEventListener('dblclick', function() {
            const streamer = this.getAttribute('data-streamer') || this.querySelector('h3').textContent;
            const followBtn = document.createElement('button');
            followBtn.className = 'follow-btn';
            followBtn.innerHTML = '<i class="fas fa-plus"></i> Follow';
            this.appendChild(followBtn);
            setTimeout(() => {
                followBtn.remove();
            }, 3000);
        });
    });
});