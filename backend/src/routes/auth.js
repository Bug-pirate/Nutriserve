const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middlewares/auth');

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
    

        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({message: 'Please fill in all fields'});
        }

        if (password != confirmPassword) {
            return res.status(400).json({ message: 'Passworddo not match'});
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 character' });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({ message: existingUser.email == email ? 'Email already registered' : 'Phone number already registered'});
        }

        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password
        });

        await user.save();

        const token = generateToken(user._id);

        // Set cookie (optional for frontend)
        res.cookie('token', token, {
            httpOnly: false, // Allow frontend to access
            secure: false, // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: 'User registered successfully', 
            token, 
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); 
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        // Set cookie (optional for frontend)
        res.cookie('token', token, {
            httpOnly: false, // Allow frontend to access
            secure: false, // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName, 
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get current user 
router.get('/me', auth, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email, 
                phone: req.user.phone,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout - clear cookie
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;