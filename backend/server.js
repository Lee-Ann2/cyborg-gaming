require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const SECRET_KEY = 'cyborg_secret_key_2026';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./cyborg.db', (err) => {
    if (err) {
        console.error('Database error:', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            gamertag TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

app.post('/api/signup', async (req, res) => {
    const { username, email, password, gamertag } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (username, email, password, gamertag) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, gamertag || username],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ success: false, error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ success: false, error: 'Database error' });
                }
                
                const token = jwt.sign({ id: this.lastID, username }, SECRET_KEY, { expiresIn: '7d' });
                res.json({ success: true, userId: this.lastID, token });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Database error' });
        }
        
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                gamertag: user.gamertag
            }
        });
    });
});

app.get('/api/popular-games', async (req, res) => {
    const RAWG_API_KEY = process.env.RAWG_API_KEY;
    
    if (!RAWG_API_KEY) {
        return res.status(500).json({ success: false, error: 'API key not configured' });
    }
    
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=8`);
        const data = await response.json();
        res.json({ success: true, games: data.results });
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch games' });
    }
});

app.get('/api/games/search/:query', async (req, res) => {
    const RAWG_API_KEY = process.env.RAWG_API_KEY;
    const query = req.params.query;
    
    if (!RAWG_API_KEY) {
        return res.status(500).json({ success: false, error: 'API key not configured' });
    }
    
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=20`);
        const data = await response.json();
        res.json({ success: true, games: data.results });
    } catch (error) {
        console.error('Error searching games:', error);
        res.status(500).json({ success: false, error: 'Failed to search games' });
    }
});

app.get('/api/games/:id', async (req, res) => {
    const RAWG_API_KEY = process.env.RAWG_API_KEY;
    const gameId = req.params.id;
    
    if (!RAWG_API_KEY) {
        return res.status(500).json({ success: false, error: 'API key not configured' });
    }
    
    try {
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`);
        const data = await response.json();
        res.json({ success: true, game: data });
    } catch (error) {
        console.error('Error fetching game details:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch game details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});