const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.post('/api/signup', (req, res) => {
    const { username, email, password, gamertag } = req.body;
    
    db.findUserByEmail(email, (result) => {
        if (result.success && result.user) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        db.findUserByUsername(username, (result) => {
            if (result.success && result.user) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            
            db.createUser({ username, email, password, gamertag }, (result) => {
                if (result.success) {
                    res.json({ 
                        success: true, 
                        message: 'User created successfully',
                        userId: result.userId 
                    });
                } else {
                    res.status(500).json({ error: result.error });
                }
            });
        });
    });
});

app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;
    
    db.login(email, password, (result) => {
        if (result.success) {
            res.json({ 
                success: true, 
                user: result.user,
                message: 'Login successful' 
            });
        } else {
            res.status(401).json({ error: result.error });
        }
    });
});

app.get('/api/profile/:userId', (req, res) => {
    const userId = req.params.userId;
    
    db.getUserProfile(userId, (result) => {
        if (result.success) {
            res.json({ success: true, user: result.user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

app.post('/api/logout/:userId', (req, res) => {
    const userId = req.params.userId;
    
    db.updateUserStatus(userId, 'offline', (result) => {
        if (result.success) {
            res.json({ success: true, message: 'Logged out successfully' });
        } else {
            res.status(500).json({ error: result.error });
        }
    });
});

app.post('/api/clips/add', (req, res) => {
    const { userId, clipName } = req.body;
    
    db.addClip(userId, clipName, (result) => {
        if (result.success) {
            res.json({ success: true, clipId: result.clipId });
        } else {
            res.status(500).json({ error: result.error });
        }
    });
});

app.get('/api/export', (req, res) => {
    const data = db.importFromJSON();
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No export data found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Database initialized at ${db.dbPath}`);
    console.log(`JSON export at ${db.jsonPath}`);
});