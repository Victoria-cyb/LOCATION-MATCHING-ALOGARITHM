const express = require('express');
const { matchFunction } = require('../controllers/matchController'); // ✅ Check this import
const auth = require('../middleware/auth');

const router = express.Router();

// Debugging logs
console.log("matchFunction Type:", typeof matchFunction);
console.log("matchFunction Value:", matchFunction);

router.post('/match/:userId', matchFunction); // ✅ Ensure matchFunction is valid

module.exports = router;
