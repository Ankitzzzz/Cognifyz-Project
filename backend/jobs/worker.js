require('dotenv').config();
const { Submission } = require('../models');
const { getWeatherByCity } = require('../services/externalService');

async function enrichSubmission(submissionId) {
  console.log('🔄 Processing submission:', submissionId);

  const sub = await Submission.findByPk(submissionId);
  if (!sub) {
    throw new Error('Submission not found');
  }

  const city = sub.name || 'London';
  const weather = await getWeatherByCity(city);

  sub.enriched = {
    summary: weather?.weather?.[0]?.description || null,
    temp: weather?.main?.temp || null
  };

  await sub.save();

  console.log('✅ Enrichment completed:', submissionId);
}

module.exports = { enrichSubmission };
