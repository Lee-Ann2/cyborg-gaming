document.addEventListener('DOMContentLoaded', async function() {
    
    const currentUser = window.auth?.getCurrentUser();
    
    if (!currentUser) {
        window.location.href = '/frontend/public/form/signin.html';
        return;
    }
    
    const updatedUser = await window.auth.refreshProfile();
    
    const displayNameElement = document.getElementById('displayUsername');
    const profileNameElement = document.getElementById('profileUsername');
    const profileBtnName = document.querySelector('.profile-icon span:first-of-type');
    
    if (displayNameElement) {
        displayNameElement.textContent = updatedUser.username || updatedUser.gamertag;
    }
    
    if (profileNameElement) {
        profileNameElement.textContent = updatedUser.username || updatedUser.gamertag;
    }
    
    if (profileBtnName) {
        profileBtnName.textContent = updatedUser.username || updatedUser.gamertag;
    }
    
    if (updatedUser.stats && updatedUser.stats.length > 0) {
        const dota2Item = document.querySelector('[data-game="dota2"] .lib-col:nth-child(3) strong');
        const fortniteItem = document.querySelector('[data-game="fortnite"] .lib-col:nth-child(3) strong');
        const csgoItem = document.querySelector('[data-game="csgo"] .lib-col:nth-child(3) strong');
        
        const dota2Stat = updatedUser.stats.find(s => s.game_name === 'Dota2');
        const fortniteStat = updatedUser.stats.find(s => s.game_name === 'Fortnite');
        const csgoStat = updatedUser.stats.find(s => s.game_name === 'CS-GO');
        
        if (dota2Item && dota2Stat) {
            const hours = dota2Stat.hours_played;
            const mins = Math.floor((hours % 1) * 60);
            dota2Item.textContent = `${Math.floor(hours)}H ${mins}Mins`;
        }
        if (fortniteItem && fortniteStat) {
            const hours = fortniteStat.hours_played;
            const mins = Math.floor((hours % 1) * 60);
            fortniteItem.textContent = `${Math.floor(hours)}H ${mins}Mins`;
        }
        if (csgoItem && csgoStat) {
            const hours = csgoStat.hours_played;
            const mins = Math.floor((hours % 1) * 60);
            csgoItem.textContent = `${Math.floor(hours)}H ${mins}Mins`;
        }
    }
    
    if (updatedUser.clips && updatedUser.clips.length > 0) {
        const clipCards = document.querySelectorAll('.clip-card');
        clipCards.forEach((card, index) => {
            if (updatedUser.clips[index]) {
                const clipNumber = card.querySelector('.clip-number');
                const clipViews = card.querySelector('.clip-views');
                
                if (clipNumber) {
                    clipNumber.textContent = updatedUser.clips[index].clip_name;
                }
                if (clipViews) {
                    clipViews.innerHTML = `<i class="fas fa-eye"></i> ${updatedUser.clips[index].views}`;
                }
            }
        });
    }
    
    const gamesDownloadedStat = document.querySelector('.stat-circle:first-child .stat-number');
    const friendsOnlineStat = document.querySelector('.stat-circle:nth-child(2) .stat-number');
    const clipsCountStat = document.querySelector('.stat-circle:last-child .stat-number');
    
    if (gamesDownloadedStat) {
        gamesDownloadedStat.textContent = updatedUser.games_downloaded || '16';
    }
    if (friendsOnlineStat) {
        friendsOnlineStat.textContent = updatedUser.friends_online || '29';
    }
    if (clipsCountStat) {
        clipsCountStat.textContent = updatedUser.clips_count || '08';
    }
    
    const statusInfo = document.querySelector('.status-info p');
    if (statusInfo) {
        const status = updatedUser.status || 'offline';
        if (status === 'online') {
            statusInfo.innerHTML = '<i class="fas fa-circle" style="color: #4ade80;"></i> Online';
        } else {
            statusInfo.innerHTML = '<i class="fas fa-circle offline-dot"></i> Offline';
        }
    }
    
    const clipsCountSpan = document.querySelector('.clips-count');
    if (clipsCountSpan && updatedUser.clips) {
        clipsCountSpan.textContent = `${updatedUser.clips.length} clips`;
    }
    
    console.log('Logged in as:', updatedUser);
    
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            navItems.forEach(nav => nav.classList.remove('active-nav'));
            this.classList.add('active-nav');
        });
    });
    
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
                    <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                `;
                
                profileBtn.style.position = 'relative';
                profileBtn.appendChild(dropdown);
                
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', async function(e) {
                        e.preventDefault();
                        await window.auth?.logout();
                    });
                }
            }
            
            dropdown.classList.toggle('show');
        });
    }
    
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('profileDropdown');
        const profileBtn = document.getElementById('profileBtn');
        
        if (dropdown && profileBtn && !profileBtn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('click', function() {
            const query = prompt('Search for games, streams, or clips:');
            if (query) {
                window.location.href = `/frontend/public/browse.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
    
    const searchSpan = document.querySelector('.search-bar span');
    if (searchSpan) {
        searchSpan.addEventListener('click', function(e) {
            e.stopPropagation();
            const query = prompt('Search for games, streams, or clips:');
            if (query) {
                window.location.href = `/frontend/public/browse.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
    
    const startLiveBtn = document.getElementById('startLiveBtn');
    if (startLiveBtn) {
        startLiveBtn.addEventListener('click', function() {
            window.location.href = '/frontend/public/streams.html?live=start';
        });
    }
    
    const clipCards = document.querySelectorAll('.clip-card');
    clipCards.forEach((card) => {
        card.addEventListener('click', function() {
            const clipName = this.querySelector('.clip-number').textContent;
            window.location.href = `/frontend/public/details.html?clip=${encodeURIComponent(clipName)}`;
        });
    });
    
    const loadMoreBtn = document.getElementById('loadMoreClipsBtn');
    let extraClipsLoaded = false;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async function() {
            if (!extraClipsLoaded) {
                const clipsGrid = document.getElementById('clipsGrid');
                
                const newClips = [
                    { name: 'Fifth Clip', views: '67' },
                    { name: 'Sixth Clip', views: '42' }
                ];
                
                for (const clip of newClips) {
                    const newCard = document.createElement('div');
                    newCard.className = 'clip-card';
                    newCard.innerHTML = `
                        <div class="clip-thumbnail">
                            <i class="fas fa-play-circle play-icon-small"></i>
                            <span class="clip-number">${clip.name}</span>
                        </div>
                        <div class="clip-views">
                            <i class="fas fa-eye"></i> ${clip.views}
                        </div>
                    `;
                    clipsGrid.appendChild(newCard);
                    
                    newCard.addEventListener('click', function() {
                        window.location.href = `/frontend/public/details.html?clip=${encodeURIComponent(clip.name)}`;
                    });
                }
                
                extraClipsLoaded = true;
                loadMoreBtn.innerHTML = '<i class="fas fa-check-circle"></i> Loaded!';
                loadMoreBtn.disabled = true;
                loadMoreBtn.style.opacity = '0.7';
            }
        });
    }
    
    const libraryItems = document.querySelectorAll('.library-item');
    libraryItems.forEach(item => {
        item.addEventListener('click', function() {
            const gameName = this.querySelector('.game-name').textContent;
            window.location.href = `/frontend/public/details.html?game=${encodeURIComponent(gameName)}`;
        });
    });
    
    const statCircles = document.querySelectorAll('.stat-circle');
    statCircles.forEach(circle => {
        circle.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#3f3570';
            this.style.borderColor = '#e0b0ff';
        });
        circle.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.borderColor = '';
        });
    });
    
    const downloadBadges = document.querySelectorAll('.downloaded-badge');
    downloadBadges.forEach(badge => {
        badge.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    const footer = document.querySelector('.cyborg-footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = `Copyright @ ${year} Cyborg Gaming Company. All rights reserved.`;
    }
    
    const avatarLarge = document.querySelector('.avatar-large i');
    if (avatarLarge) {
        avatarLarge.addEventListener('click', function() {
            alert('Change profile picture feature coming soon!');
        });
    }
});