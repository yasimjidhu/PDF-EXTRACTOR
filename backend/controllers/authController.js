const User = require('../model/user')
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    console.log('request reached in backend', req.body)
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('user   exists')
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, email, password });
        res.status(201).json({ _id: user._id, username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({success:false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({success:true, _id: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const logoutUser = async (req, res) => {
    try {
        console.log('logout reached in backend')
        // Clear the token cookie
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0), 
        });

        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        res.status(500).json({ error: 'Error logging out' });
    }
};



module.exports = {
    loginUser,
    registerUser,
    logoutUser
}