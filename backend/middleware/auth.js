const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    const token = authHeader.split(' ')[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'change-me'
    );

    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // attach user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Request not authorized' });
  }
};
