const {DataTypes} = require("sequelize");
const db = require("../db");

const Movie = db.define("movie", {
    user_rating: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    comments: {
        type: DataTypes.STRING
    },
    movie: {
        type: DataTypes.JSON,
        allowNull: false
    }
});

module.exports = Movie;