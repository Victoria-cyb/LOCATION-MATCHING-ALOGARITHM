const mongoose = require ('mongoose');



const userSchema = mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    email:{ type: String,
            required: true,
            unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,

    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'

        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
  
});

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);
module.exports = User;