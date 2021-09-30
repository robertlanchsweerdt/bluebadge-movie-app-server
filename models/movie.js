// Here is where we create the Model for the movieController
// we use Sequelize to create the Table.  This means the number of columns,
// the headings, and the type of data stored.
// For this model, I have a table with 5 columns, and using 4 DataTypes
// (String, Integer, Boolean and JSON).

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
