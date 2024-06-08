const _ = require('lodash');

const responseServiceInstance = {
    response: async function(records) {
        try {
            const contact = {
                primaryContactId: -1,
                emails: [],
                phoneNumbers: [],
                secondaryContactIds: []
            };
            for(let user of records) {
                if(user.linkPrecedence === 'primary') {
                    contact.primaryContactId = user.id;
                    contact.emails.unshift(user.email);
                    contact.phoneNumbers.unshift(user.phoneNumber);
                } else {
                    contact.secondaryContactIds.push(user.id);
                }
            }
            return { "contact" : contact };
        } catch(error) {
            console.error('some error occured: ', error);
        }
    }
};

module.exports = responseServiceInstance;