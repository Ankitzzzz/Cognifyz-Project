const { Sequelize } = require('sequelize');

const DATABASE_URL =
  process.env.DATABASE_URL || 'sqlite:./db/database.sqlite';

const sequelize = new Sequelize(DATABASE_URL, {
  logging: process.env.NODE_ENV === 'production' ? false : console.log
});

// Import models
const User = require('./user')(sequelize);
const Submission = require('./submission')(sequelize);

// Associations
User.hasMany(Submission, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  hooks: true // ensures cascade works in Sequelize
});

Submission.belongsTo(User, {
  foreignKey: 'userId'
});

module.exports = {
  sequelize,
  User,
  Submission
};
