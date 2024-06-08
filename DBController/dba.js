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
                let [isPartialMatch, partialMatchedRecords] = await this.fetchOnPartialMatch(email, phoneNumber);
                if(isPartialMatch) {
                    //  there may exist multiple primary records here
                    //  we need to have only one primary and remaining
                    //  should be marked as secondary records
                    //  The record that is created earliest is the primary and
                    //  rest all are secondary records.
                    partialMatchedRecords = await this.update(email, phoneNumber, partialMatchedRecords);
                    return partialMatchedRecords;
                } else {
                    //  the request is a primary record
                    const newUser = await this.create(email, phoneNumber);
                    return newUser;
                }
            } 
            return await this.update(email, phoneNumber, records);
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
                });
            });
            return result;
        } catch(error) {
            console.error('error retrieving users from the database: ', error);
        }
    },

    create: async function(email, phoneNumber) {
        try {
            const id = kgs.getId();
            const newUser = await User.create({
                id,
                email,
                phoneNumber,
            });
            return [newUser];
        } catch(error) {
            console.error('error creating record: ', error);
        }
    },

    createSecondary: async function(email, phoneNumber, parentId) {
        try {
            const id = kgs.getId();
            const newUser = await User.create({
                id,
                email,
                phoneNumber,
                linkedId: parentId,
                linkPrecedence: "secondary",
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
                    result.push(user);
                });
            });
            if(result === undefined || result.length == 0)
                return [false, []];
            return [true, result];
        } catch (error) {
            console.error('error obtaining records from the db: ', error);
        }
    },

    update: async function(email, phoneNumber, matchedRecords) {
        try {
            const result = [];
            const targetRecord = await User.findOne({
                where: {
                    [Op.or] : [
                        {email: email},
                        {phoneNumber: phoneNumber}
                    ],
                },
            });
            const primaryId = targetRecord.linkedId ?? targetRecord.id;
            console.log('primary record found with id: ', primaryId);

            const primaryRecord = await User.findOne({
                where: {
                    id: primaryId
                }
            });

            result.push(primaryRecord);

            if(email !== null && phoneNumber !== null) {
                const secondary = await this.create(email, phoneNumber);
                matchedRecords.push(secondary[0]);
            }

            for(let user of matchedRecords) {
                if(user.id != primaryId) {
                    let isChanged = false;
                    if(user.linkPrecedence !== "secondary") {
                        isChanged = true;
                        user.linkPrecedence = "secondary";
                    }
                    if(user.linkedId !== primaryId) {
                        isChanged = true;
                        user.linkedId = primaryId;
                    }
                    isChanged && await user.save();
                    result.push(user);
                } 
            }
            return result;
        } catch(error) {
            console.error('error occured: ', error);
        }
    }

};

module.exports = dba;