const kgs = {
    getId: function() {
        const rn = Math.floor(Math.random() * 1000) + 1;
        return rn;
    }
};

module.exports = kgs;