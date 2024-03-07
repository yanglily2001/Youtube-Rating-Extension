const { Sequelize, DataTypes } = require('sequelize');

// Create Sequelize instance and connect it to SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '/Users/lilyyang/Desktop/extension/database.db',
});

const VideoRating = sequelize.define('VideoRating', {
  videoURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Sync model with database (create the table if it doesn't exist)
sequelize.sync();

module.exports = { VideoRating };