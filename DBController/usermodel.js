const { DataTypes } = require('sequelize');
const sequelize = require('./config');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    linkedId: {
        type: DataTypes.INTEGER,
    },
    linkPrecedence: {
        type: DataTypes.STRING,
    },
    // createdAt: {
    //     type: DataTypes.DATE,
    // },
    // updatedAt: {
    //     type: DataTypes.DATE,
    // },
    deletedAt: {
        type: DataTypes.DATE,
    }
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;