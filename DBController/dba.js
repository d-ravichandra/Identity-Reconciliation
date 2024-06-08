const sequelize = require('./config');
const User = require('./usermodel');
const kgs = require('../KGS/kgs');
const { Op } = require('sequelize');

const dba = {

    connect: async function() {
        try {
            await sequelize.authenticate();
            console.log("connection succesful");
            await sequelize.sync();
            return true;
        } catch(error) {
            console.log("unable to connect to the database");
            console.log(error);
        }
    },

    fetch: async function(email, phoneNumber) {
        try {
            const records = await User.findAll({
                where: {
                    [Op.or] : [
                        {email: email},
                        {phoneNumber: phoneNumber}
                    ]
                }
            });
            return records;
        } catch(error) {
            console.error('error retrieving users from the database: ', error);
        }
    },

    create: async function(email, phoneNumber) {
        try {
            const records = await this.fetch(email, phoneNumber);
            const id = kgs.getId();
            console.log(records);
            //  create a new record if it does not exist already
            if(records === undefined || records.length == 0) {
                const newUser = User.create({
                    id,
                    email,
                    phoneNumber,
                });
            }
        } catch(error) {
            console.log('error creating record: ', error);
        }
    }

};

module.exports = dba;