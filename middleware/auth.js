const  config = require('../config/config');
const jwt = require('jsonwebtoken')


const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);
    const token = authHeader?.replace('Bearer ', '');
    console.log('Extracted Token:', token);
    console.log('Config:', config); // Log the entire config object
    console.log('JWT Secret:', config.jwtSecret);
    if (!config || !config.jwtSecret) {
        console.error('JWT Secret is not defined in config');
        return res.status(500).json({ message: 'Server configuration error' });
    }
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('JWT Verify Error:', error.message);
        res.status(401).json({ message: 'Token is not valid' })
    }
};


module.exports = auth;