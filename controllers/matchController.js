const User = require('../models/user');
const Match = require('../models/match')


const matchFunction = async (req, res) => {
    try {
        console.log('Params:', req.params);
        const currentUser = await User.findById(req.params.userId);
        console.log('Current User:', currentUser);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const nearbyUsers = await User.find({
      _id: { $ne: currentUser._id }, // Exclude the current user
      location: {
        $near: {
          $geometry: currentUser.location,
          $maxDistance: 10000, // 10km in meters
        },
      },
    }).limit(5); // Limit to 5 matches

    if (nearbyUsers.length === 0) {
        return res.status(404).json({ message: 'No nearby users found' });
      }
  
      const matches = await Promise.all(
        nearbyUsers.map(async (nearbyUser) => {
          const distance = calculateDistance(
            currentUser.location.coordinates,
            nearbyUser.location.coordinates
          );
          const match = new Match({
            user1: currentUser._id,
            user2: nearbyUser._id,
            distance,
          });
          await match.save();
          return { user: nearbyUser.name, distance };
        })
      );
        res.json({ message: 'Match successful', matches });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ message: error.message });
    }

};

function calculateDistance(coord1, coord2) {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// ✅ Ensure correct export
module.exports = { matchFunction }; // ✅ Export as an object
