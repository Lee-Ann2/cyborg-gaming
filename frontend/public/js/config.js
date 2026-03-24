const API_BASE_URL = 'http://localhost:3000/api';

async function getPopularGames(limit = 8) {
    try {
        const response = await fetch(`${API_BASE_URL}/popular-games`);
        const data = await response.json();
        
        if (data.success) {
            return data.games.map(game => ({
                id: game.id,
                name: game.name,
                rating: game.rating ? game.rating.toFixed(1) : '4.5',
                rating_count: game.ratings_count || 0,
                released: game.released ? game.released.split('-')[0] : '2024',
                background_image: game.background_image,
                genres: game.genres ? game.genres.map(g => g.name).slice(0, 2) : []
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching games:', error);
        return [];
    }
}

async function searchGames(query, limit = 20) {
    try {
        const response = await fetch(`${API_BASE_URL}/games/search/${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success) {
            return data.games.map(game => ({
                id: game.id,
                name: game.name,
                rating: game.rating ? game.rating.toFixed(1) : '4.5',
                background_image: game.background_image,
                released: game.released ? game.released.split('-')[0] : '2024'
            }));
        }
        return [];
    } catch (error) {
        console.error('Error searching games:', error);
        return [];
    }
}

async function getGameDetails(gameId) {
    try {
        const response = await fetch(`${API_BASE_URL}/games/${gameId}`);
        const data = await response.json();
        
        if (data.success) {
            const game = data.game;
            return {
                id: game.id,
                name: game.name,
                description: game.description_raw || 'No description available',
                rating: game.rating ? game.rating.toFixed(1) : '4.5',
                rating_count: game.ratings_count || 0,
                released: game.released || '2024',
                background_image: game.background_image,
                background_image_additional: game.background_image_additional,
                platforms: game.platforms ? game.platforms.map(p => p.platform.name) : [],
                genres: game.genres ? game.genres.map(g => g.name) : [],
                publishers: game.publishers ? game.publishers.map(p => p.name).slice(0, 3) : [],
                developers: game.developers ? game.developers.map(d => d.name).slice(0, 3) : [],
                website: game.website,
                metacritic: game.metacritic,
                playtime: game.playtime
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching game details:', error);
        return null;
    }
}