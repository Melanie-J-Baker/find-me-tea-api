const express = require('express');
const asyncHandler = require("express-async-handler");
const router = express.Router();
const fetch = require('node-fetch');

/* GET request to get Google Maps API Key */
router.get('/google-maps-api-key', (req, res, next) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  res.json({
    apiKey
  })
})

/* POST request that sends GET request to Google Places API data to get nearby tea locations. */
router.post('/search', asyncHandler(async(req, res, next) => {
  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.location,places.formattedAddress,places.id'
      },
      body: JSON.stringify({
        // Filter results to only include places that serve tea
        includedTypes: ['breakfast_restaurant', 'cafe', 'cat_cafe', 'coffee_shop', 'diner', 'dog_cafe', 'tea_house'],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude: req.body.latitude,
              longitude: req.body.longitude
            },
            radius: 2000.0 // 2 km
          }
        }
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: error.message, status: error.status, body: error.body });
  }
}));

module.exports = router;
