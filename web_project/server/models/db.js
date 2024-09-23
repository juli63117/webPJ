const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('Health_in_a_basket', 'postgres', '12345', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

module.exports = sequelize;