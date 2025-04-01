const User = require('../models/user');
const { geocodeAddress } = require('../services/geoServices');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserLocation = async (req, res) => {
    const { address } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!address) return res.status(400).json({ message: 'Address is required' });

        user.address = address;
        user.location = await geocodeAddress(address);

        await user.save();
        res.json({ message: 'Location updated', user });
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
}

// ✅ Correctly export as an object
module.exports = { 
    getUserProfile,
    updateUserLocation
 };  // ✅ Export as an object
