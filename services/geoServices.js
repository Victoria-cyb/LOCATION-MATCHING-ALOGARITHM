const axios = require('axios');
const config = require('../config/config');

const kmToRadians = (km) => km / 6371; // Earth radius ~6371 km
const metersToKm = (meters) => meters / 1000;

const geocodeAddress = async (address) => {
    console.log('Config in geoServices:', config);
  try {
      console.log('Fetching coordinates for:', address);

    const response = await axios.get('https://us1.locationiq.com/v1/search.php', {
      params: {
        key: config.locationIqApiKey,
        q:address,
        format: 'json',
      },
    });


    
    if (!Array.isArray(response.data) || response.data.length === 0) {
        console.warn('No geocoding results found for the provided address:', address);
        return null;
      }
    const { lon, lat } = response.data[0];

    const location = { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] };

    console.log('Geocoded Location:', location);
    return location;
    
    
  } catch (error) {
    console.error('Geocoding Error:', error.response?.data || error.message);
    return null; 
  }
};

module.exports = { kmToRadians, metersToKm, geocodeAddress };