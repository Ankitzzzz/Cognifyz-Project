require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running ✅' });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// DB + Server start
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
