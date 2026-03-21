const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/cyborg.db');
const jsonPath = path.join(__dirname, '../data/products.json');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        gamertag TEXT,
        status TEXT DEFAULT 'offline',
        games_downloaded INTEGER DEFAULT 16,
        friends_online INTEGER DEFAULT 29,
        clips_count INTEGER DEFAULT 8,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_name TEXT NOT NULL,
        hours_played INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_clips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        clip_name TEXT NOT NULL,
        views INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_name TEXT NOT NULL,
        date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
        hours_played INTEGER DEFAULT 0,
        downloaded BOOLEAN DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    initializeJsonFile();
}

function initializeJsonFile() {
    if (!fs.existsSync(jsonPath)) {
        const defaultData = {
            games: [
                { id: 1, name: "Dota2", genre: "MOBA", rating: 4.8, downloads: 2300000 },
                { id: 2, name: "Fortnite", genre: "Battle Royale", rating: 4.7, downloads: 3100000 },
                { id: 3, name: "CS-GO", genre: "Shooter", rating: 4.9, downloads: 4200000 }
            ],
            clips: [
                { id: 1, name: "Epic Victory", views: 1250 },
                { id: 2, name: "Clutch Moment", views: 890 },
                { id: 3, name: "Insane Play", views: 2340 }
            ]
        };
        fs.writeFileSync(jsonPath, JSON.stringify(defaultData, null, 2));
    }
}

function findUserByEmail(email, callback) {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            callback({ success: false, error: err.message });
        } else {
            callback({ success: true, user: row });
        }
    });
}

function findUserByUsername(username, callback) {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            callback({ success: false, error: err.message });
        } else {
            callback({ success: true, user: row });
        }
    });
}

function createUser(userData, callback) {
    const { username, email, password, gamertag } = userData;
    db.run('INSERT INTO users (username, email, password, gamertag) VALUES (?, ?, ?, ?)',
        [username, email, password, gamertag || username],
        function(err) {
            if (err) {
                callback({ success: false, error: err.message });
            } else {
                const userId = this.lastID;
                
                const defaultStats = [
                    { game_name: 'Dota2', hours_played: 634 },
                    { game_name: 'Fortnite', hours_played: 745 },
                    { game_name: 'CS-GO', hours_played: 632 }
                ];
                
                defaultStats.forEach(stat => {
                    db.run('INSERT INTO user_stats (user_id, game_name, hours_played) VALUES (?, ?, ?)',
                        [userId, stat.game_name, stat.hours_played]);
                });
                
                const defaultClips = [
                    { clip_name: 'FirstClip', views: 250 },
                    { clip_name: 'Second Clip', views: 183 },
                    { clip_name: 'Third Clip', views: 141 },
                    { clip_name: 'Fourth Clip', views: 91 }
                ];
                
                defaultClips.forEach(clip => {
                    db.run('INSERT INTO user_clips (user_id, clip_name, views) VALUES (?, ?, ?)',
                        [userId, clip.clip_name, clip.views]);
                });
                
                const defaultGames = [
                    { game_name: 'Dota2', hours_played: 634 },
                    { game_name: 'Fortnite', hours_played: 745 },
                    { game_name: 'CS-GO', hours_played: 632 }
                ];
                
                defaultGames.forEach(game => {
                    db.run('INSERT INTO user_games (user_id, game_name, hours_played) VALUES (?, ?, ?)',
                        [userId, game.game_name, game.hours_played]);
                });
                
                callback({ success: true, userId: userId });
            }
        });
}

function login(email, password, callback) {
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            callback({ success: false, error: err.message });
        } else if (!row) {
            callback({ success: false, error: 'Invalid email or password' });
        } else {
            db.run('UPDATE users SET status = ? WHERE id = ?', ['online', row.id]);
            
            getUserProfile(row.id, (profileResult) => {
                if (profileResult.success) {
                    callback({ success: true, user: profileResult.user });
                } else {
                    callback({ success: false, error: profileResult.error });
                }
            });
        }
    });
}

function getUserProfile(userId, callback) {
    db.get('SELECT id, username, email, gamertag, status, games_downloaded, friends_online, clips_count FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            callback({ success: false, error: err.message });
        } else if (!user) {
            callback({ success: false, error: 'User not found' });
        } else {
            db.all('SELECT game_name, hours_played FROM user_stats WHERE user_id = ?', [userId], (err, stats) => {
                if (err) {
                    callback({ success: false, error: err.message });
                } else {
                    db.all('SELECT clip_name, views FROM user_clips WHERE user_id = ?', [userId], (err, clips) => {
                        if (err) {
                            callback({ success: false, error: err.message });
                        } else {
                            db.all('SELECT game_name, date_added, hours_played, downloaded FROM user_games WHERE user_id = ?', [userId], (err, games) => {
                                if (err) {
                                    callback({ success: false, error: err.message });
                                } else {
                                    const userProfile = {
                                        ...user,
                                        stats: stats,
                                        clips: clips,
                                        games: games
                                    };
                                    callback({ success: true, user: userProfile });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function updateUserStatus(userId, status, callback) {
    db.run('UPDATE users SET status = ? WHERE id = ?', [status, userId], function(err) {
        if (err) {
            callback({ success: false, error: err.message });
        } else {
            callback({ success: true });
        }
    });
}

function addClip(userId, clipName, callback) {
    db.run('INSERT INTO user_clips (user_id, clip_name, views) VALUES (?, ?, ?)', [userId, clipName, 0], function(err) {
        if (err) {
            callback({ success: false, error: err.message });
        } else {
            db.run('UPDATE users SET clips_count = clips_count + 1 WHERE id = ?', [userId]);
            callback({ success: true, clipId: this.lastID });
        }
    });
}

function importFromJSON() {
    try {
        const data = fs.readFileSync(jsonPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return null;
    }
}

module.exports = {
    dbPath,
    jsonPath,
    findUserByEmail,
    findUserByUsername,
    createUser,
    login,
    getUserProfile,
    updateUserStatus,
    addClip,
    importFromJSON
};