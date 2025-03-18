const express = require('express');
const asyncHandler = require("express-async-handler");
const router = express.Router();

/* POST request for Google Places API data to get nearby tea locations. */
router.post('/search', asyncHandler(async(req, res, next) => {
  const fetch = (await import('node-fetch')).default; // Dynamically import fetch
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
  }).then((response) => response.json());
  return res.json(response);
}))

module.exports = router;
