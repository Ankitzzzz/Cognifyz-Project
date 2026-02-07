const axios = require('axios');

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;

async function getWeatherByCity(city) {
  if (!OPENWEATHER_KEY) {
    // silent fail (no crash, no restart)
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_KEY}&units=metric`;

    const response = await axios.get(url, { timeout: 5000 });
    return response.data;
  } catch (err) {
    console.error('Weather API failed:', err.message);
    return null;
  }
}

module.exports = { getWeatherByCity };
