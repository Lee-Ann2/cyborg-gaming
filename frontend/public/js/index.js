document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('gameSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResult = document.getElementById('searchResult');
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            window.location.href = './form/signup.html';
        });
    }
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', async function() {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `./browse.html?search=${encodeURIComponent(query)}`;
            } else {
                searchResult.innerHTML = 'Please enter a game name';
                searchResult.style.color = '#ff8a8a';
                setTimeout(() => {
                    searchResult.innerHTML = '';
                }, 2000);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `./browse.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
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
});