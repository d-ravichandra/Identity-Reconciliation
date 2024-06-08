const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('bitespeed', 'root', 'root', {
//     host: 'localhost',
//     dialect: 'mysql',
//     logging: false,
// });

const db = 'postgres://users_mwqc_user:yB6XP2JlpEf3eJjsZOqCZcb3dRhF5NOo@dpg-cpi62csf7o1s73bcn2c0-a/users_mwqc';

const sequelize = new Sequelize(db, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false
});

module.exports = sequelize;