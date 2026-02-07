const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/auth');
const { Submission } = require('../../models');
const { enrichSubmission } = require('../../utils/enrichment');




// List submissions (public)
router.get('/', async (req, res, next) => {
  try {
    const items = await Submission.findAll({
      order: [['createdAt', 'DESC']],
      limit: 200
    });

    res.json({ submissions: items });
  } catch (err) {
    next(err);
  }
});

// Create submission (PURE NODE background task)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const submission = await Submission.create({
      name,
      email,
      message,
      userId: req.user.id
    });

    // 🔥 Run enrichment in background (non-blocking)
    setImmediate(async () => {
      try {
        await enrichSubmission(submission.id);
      } catch (err) {
        console.error('Enrichment failed:', err.message);
      }
    });

    res.status(201).json({ submission });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
