const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcryptjs');

router.post('/signup', async (req, res) => {
    const { username, email, password, gamertag } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    db.findUserByEmail(email, (result) => {
        if (result.success && result.user) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        db.findUserByUsername(username, (result) => {
            if (result.success && result.user) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            
            const hashedPassword = bcrypt.hashSync(password, 10);
            
            db.createUser({ username, email, password: hashedPassword, gamertag }, (result) => {
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

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    db.findUserByEmail(email, (result) => {
        if (!result.success || !result.user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isValidPassword = bcrypt.compareSync(password, result.user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        db.updateUserStatus(result.user.id, 'online', (statusResult) => {
            db.getUserProfile(result.user.id, (profileResult) => {
                if (profileResult.success) {
                    const { password: _, ...userWithoutPassword } = profileResult.user;
                    res.json({ 
                        success: true, 
                        user: userWithoutPassword,
                        message: 'Login successful' 
                    });
                } else {
                    res.status(500).json({ error: profileResult.error });
                }
            });
        });
    });
});

router.get('/profile/:userId', (req, res) => {
    const userId = req.params.userId;
    
    db.getUserProfile(userId, (result) => {
        if (result.success) {
            const { password: _, ...userWithoutPassword } = result.user;
            res.json({ success: true, user: userWithoutPassword });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

router.post('/logout/:userId', (req, res) => {
    const userId = req.params.userId;
    
    db.updateUserStatus(userId, 'offline', (result) => {
        if (result.success) {
            res.json({ success: true, message: 'Logged out successfully' });
        } else {
            res.status(500).json({ error: result.error });
        }
    });
});

router.post('/clips/add', (req, res) => {
    const { userId, clipName } = req.body;
    
    if (!userId || !clipName) {
        return res.status(400).json({ error: 'User ID and clip name are required' });
    }
    
    db.addClip(userId, clipName, (result) => {
        if (result.success) {
            res.json({ success: true, clipId: result.clipId });
        } else {
            res.status(500).json({ error: result.error });
        }
    });
});

router.get('/export', (req, res) => {
    const data = db.importFromJSON();
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No export data found' });
    }
});

module.exports = router;