const express = require('express');
const { getUserProfile,  updateUserLocation } = require('../controllers/userController'); // ✅ Ensure correct import
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/profile', auth, getUserProfile); // ✅ Make sure it's a function

console.log("getUserProfile Type:", typeof getUserProfile); // Debugging log
console.log("getUserProfile Value:", getUserProfile);

router.put('/location', auth, updateUserLocation)

module.exports = router;
