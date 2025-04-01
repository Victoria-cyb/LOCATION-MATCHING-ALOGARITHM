const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
  user1: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
},
  user2: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true 
},
  distance: {
     type: Number
},
  createdAt: { 
    type: Date, 
    default: Date.now 
}
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;