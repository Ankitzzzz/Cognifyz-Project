const express = require('express');
const router = express.Router();
const { getWeatherByCity } = require('../../services/externalService');

// GET /api/weather?city=London
router.get('/weather', async (req, res, next) => {
  try {
    const city =
      typeof req.query.city === 'string' && req.query.city.trim()
        ? req.query.city.trim()
        : 'London';

    const data = await getWeatherByCity(city);

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
