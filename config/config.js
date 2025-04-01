require('dotenv') .config({ path: './.env'});

const config = {
    mongoURI: process.env.MONGO_URI || "mongodb+srv://michaelvictoria0422873:danmike1602@match-algorithm.kfxawvu.mongodb.net/?retryWrites=true&w=majority&appName=match-algorithm",
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET,
    locationIqApiKey: process.env.LOCATIONIQ_API_KEY,
};

console.log('Config in config.js', config);

module.exports = config
