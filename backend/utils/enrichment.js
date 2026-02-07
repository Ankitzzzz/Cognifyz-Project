const { Submission } = require('../models');
const { getWeatherByCity } = require('../services/externalService');

async function enrichSubmission(submissionId) {
  try {
    const sub = await Submission.findByPk(submissionId);
    if (!sub) return;

    const city = sub.name || 'London';
    const weather = await getWeatherByCity(city);

    if (!weather) return;

    sub.enriched = {
      summary: weather.weather?.[0]?.description || null,
      temp: weather.main?.temp || null
    };

    await sub.save();
    console.log(`✨ Enriched submission ${submissionId}`);
  } catch (err) {
    console.error('Enrichment failed:', err.message);
  }
}

module.exports = { enrichSubmission };
