const User = require('../models/user');
const Match = require('../models/match');
const { kmToRadians, geocodeAddress } = require('./geoService');

const findNearbyUsers = async (userId, distanceKm = 5) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  let userLocation = user.location;
  if (!userLocation) {
    userLocation = await geocodeAddress(user.address);
    user.location = userLocation;
    await user.save(); // Update user with coordinates
  }

  // Coordinate-based matching
  const nearbyUsers = await User.find({
    _id: { $ne: user._id },
    location: {
      $geoWithin: {
        $centerSphere: [userLocation.coordinates, kmToRadians(distanceKm)],
      },
    },
  }).limit(10);

  // Fallback to address-based matching
  if (nearbyUsers.length === 0) {
    const addressParts = user.address.split(',').map(part => part.trim());
    const city = addressParts[addressParts.length - 2] || ''; // Rough city extraction
    const addressMatches = await User.find({
      _id: { $ne: user._id },
      address: { $regex: city, $options: 'i' },
      location: { $exists: false }, // Users without coordinates
    }).limit(10);
    return addressMatches;
  }

  return nearbyUsers;
};

const saveMatch = async (user1Id, user2Id, distance) => {
  const match = new Match({ user1: user1Id, user2: user2Id, distance });
  await match.save();
  return match;
};

module.exports = { findNearbyUsers, saveMatch };