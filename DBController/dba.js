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

    process: async function(email, phoneNumber) {
        try {
            const records = await this.fetch(email, phoneNumber);
            if(records === undefined || records.length == 0) {
                //  there is no complete match
                //  There may still exist a primary record with partial match
                const [isPartialMatch, partialMatchedRecords] = await this.fetchOnPartialMatch(email, phoneNumber);
                if(isPartialMatch) {
                    console.log('This is a partial match');
                    return partialMatchedRecords;
                } else {
                    //  the request is a primary record
                    const newUser = this.create(email, phoneNumber);
                    return [newUser];
                }
            } 
            return records;
        } catch(error) {
            console.error("some error occured: ", error);
        }
    },

    fetch: async function(email, phoneNumber) {
        try {
            const result = [];
            const records = await User.findAll({
                where: {
                    [Op.and] : [
                        {email: email},
                        {phoneNumber: phoneNumber}
                    ]
                }
            }).then(users => {
                users.forEach(user => {
                    result.push(user);
                })
            });
            return result;
        } catch(error) {
            console.error('error retrieving users from the database: ', error);
        }
    },

    create: async function(email, phoneNumber) {
        try {
            const id = kgs.getId();
            const newUser = User.create({
                id,
                email,
                phoneNumber,
            });
            return [newUser];
        } catch(error) {
            console.error('error creating record: ', error);
        }
    },

    fetchOnPartialMatch: async function(email, phoneNumber) {
        try {
            const result = [];
            const records = await User.findAll({
                where: {
                    [Op.or] : [
                        {email: email},
                        {phoneNumber: phoneNumber}
                    ]
                }
            }).then(users => {
                users.forEach(user => {
                    result.add(user);
                });
            });
            if(records === undefined || records.length == 0)
                return [false, []];
            return [true, result];
        } catch (error) {
            console.error('error obtaining records from the db: ', error);
        }
    }

};

module.exports = dba;