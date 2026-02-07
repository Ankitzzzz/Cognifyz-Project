const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Submission = sequelize.define(
    'Submission',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },

      enriched: {
        type: DataTypes.JSON,
        allowNull: true
      }
    },
    {
      timestamps: true,
      tableName: 'submissions'
    }
  );

  return Submission;
};
