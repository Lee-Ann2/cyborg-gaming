// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Interactive navigation - highlight active tab on click
    const navItems = document.querySelectorAll('.nav-links span');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active-nav'));
            // Add active class to clicked item
            this.classList.add('active-nav');
            
            // Show a simple feedback (can be customized further)
            console.log(`Navigation to ${this.textContent} clicked`);
        });
    });
    
    // 2. Game cards click interaction - show alert with game name (interactive)
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameName = this.querySelector('h3').textContent;
            alert(`🔥 ${gameName} is trending! Check it out.`);
        });
    });
    
    // 3. Library items click - simulate game launch / details
    const libraryItems = document.querySelectorAll('.library-item');
    
    libraryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent triggering when clicking on the view button inside? but view button is separate.
            // Get game name from avatar
            const gameName = this.querySelector('.game-name').textContent;
            alert(`📀 Launching ${gameName} ... (demo interaction)`);
        });
    });
    
    // 4. "View Your Library" button interaction
    const viewBtn = document.getElementById('libraryViewBtn');
    
    viewBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // prevent any parent triggers
        
        // Toggle some visual effect on library items
        const libItems = document.querySelectorAll('.library-item');
        
        libItems.forEach((item, index) => {
            // Simple animation: flash border
            item.style.transition = '0.3s';
            item.style.borderColor = '#ffb3f0';
            item.style.boxShadow = '0 0 25px #e5b3ff';
            
            // Remove after 500ms
            setTimeout(() => {
                item.style.borderColor = '';
                item.style.boxShadow = '';
            }, 500);
        });
        
        alert('Your gaming library — all systems online.');
    });
    
    // 5. Profile icon click (just a fun message)
    const profileIcon = document.querySelector('.profile-icon');
    
    profileIcon.addEventListener('click', function() {
        alert('👾 Profile: Gamer_4L online');
    });
    
    // 6. Hover effect for popular stats (extra micro interaction)
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#3f3170';
            this.style.borderColor = '#eab3ff';
        });
        
        stat.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.borderColor = '';
        });
    });
    
    // 7. Welcome block click (fun)
    const welcomeBlock = document.querySelector('.welcome-block');
    
    welcomeBlock.addEventListener('click', function() {
        // Just a playful console log, not intrusive
        console.log('✨ Welcome to Cyborg — let\'s game!');
    });
    
    // 8. Dynamic timestamp in footer (optional subtle interactive)
    const footer = document.querySelector('.foot-note');
    if (footer) {
        const date = new Date();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        footer.setAttribute('title', `Last active: ${timeStr}`);
    }
});