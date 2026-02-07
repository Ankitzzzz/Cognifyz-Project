require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Security + parsers
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || '*',
    credentials: true
  })
);

// Rate limit
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
    max: Number(process.env.RATE_LIMIT_MAX || 200)
  })
);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/submissions', require('./routes/api/submissions'));
app.use('/api/external', require('./routes/api/external'));

// Error handler
app.use(require('./middleware/errorHandler'));

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ DB connected');

    app.listen(PORT, () =>
      console.log(`🚀 Backend running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  }
})();
