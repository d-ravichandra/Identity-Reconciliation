const sequelize = require('./config');
const User = require('./usermodel');

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
                    email,
                    phoneNumber,
                }
            });
        } catch(error) {
            console.error('error retrieving users from the database: ', error);
        }
    }

};

module.exports = dba;