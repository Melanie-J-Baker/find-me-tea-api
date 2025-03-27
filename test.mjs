const fetch = require('node-fetch');

// URL and parameters for the Google Places API request
const url = 'https://places.googleapis.com/v1/places:searchNearby';
const params = {
  includedTypes: ['breakfast_restaurant', 'cafe', 'cat_cafe', 'coffee_shop', 'diner', 'dog_cafe', 'tea_house'].join(','),
  maxResultCount: 10,
  'locationRestriction.circle.center.latitude': 51.4324705,
  'locationRestriction.circle.center.longitude': 0.3873858,
  'locationRestriction.circle.radius': 2000, // 2 km radius
  key: 'YOUR_GOOGLE_API_KEY'  // Replace with your actual API key
};

// Function to fetch data from the Google Places API
const fetchData = async () => {
  try {
    // Append the parameters to the URL
    const response = await fetch(`${url}?${new URLSearchParams(params)}`);
    
    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response body
    const data = await response.json();
    console.log('Google Places API Response:', data);
  } catch (error) {
    // Handle errors
    console.error('Error:', error.message);
  }
};

// Call the fetch function
fetchData();
