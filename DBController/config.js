const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bitespeed', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;