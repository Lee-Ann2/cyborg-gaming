const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcryptjs');

router.post('/signup', (req, res) => {
    const { username, email, password, gamertag } = req.body;
    
    console.log('Signup attempt:', { username, email });
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    db.findUserByEmail(email, (result) => {
        if (result.error) {
            console.error('Email check error:', result.error);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.user) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        db.findUserByUsername(username, (result) => {
            if (result.error) {
                console.error('Username check error:', result.error);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.user) {
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
                    console.error('User creation error:', result.error);
                    res.status(500).json({ error: result.error || 'Failed to create user' });
                }
            });
        });
    });
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    
    console.log('Signin attempt:', { email });
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    db.findUserByEmail(email, (result) => {
        if (result.error) {
            console.error('Login error:', result.error);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!result.user) {
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
                    console.error('Profile fetch error:', profileResult.error);
                    res.status(500).json({ error: 'Failed to fetch user profile' });
                }
            });
        });
    });
});

router.get('/profile/:userId', (req, res) => {
    const userId = req.params.userId;
    
    console.log('Profile fetch for user:', userId);
    
    db.getUserProfile(userId, (result) => {
        if (result.success) {
            const { password: _, ...userWithoutPassword } = result.user;
            res.json({ success: true, user: userWithoutPassword });
        } else {
            console.error('Profile fetch error:', result.error);
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

router.get('/test', (req, res) => {
    res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

module.exports = router;