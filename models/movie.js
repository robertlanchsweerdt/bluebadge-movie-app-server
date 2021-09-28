const { DataTypes } = require('sequelize');
const db = require('../db');

const Movie = db.define('movie', {
  user_rating: {
    type: DataTypes.INTEGER,
  },
  watched: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
  },
  movie: {
    type: DataTypes.JSON,
  },
  owner_id: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Movie;
