const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { geocodeAddress } = require('../services/geoServices');

const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    console.log('Config in register:', config);
        console.log('JWT Secret in register:', config.jwtSecret);

    console.log('Config in authController:', config);

    // 🌍 Initialize location with a default value
    let location = { type: 'Point', coordinates: [0, 0] };

    // Fetch coordinates only if an address is provided
    if (address) {
      try {
        const geoLocation = await geocodeAddress(address);
        console.log('Geocoding result:', geoLocation);
        if (geoLocation && geoLocation.type === 'Point' && Array.isArray(geoLocation.coordinates)) {
          location = geoLocation; // Assign geocoded location
        } else {
          console.warn('Invalid geocoding result, using default location');
        }
      } catch (geoError) {
        console.error('Geocoding failed:', geoError.message);
      }
    }

    console.log('Final Location before saving:', location); 

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      location, // Ensuring location is passed properly
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
