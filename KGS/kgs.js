const kgs = {
    getId: function() {
        const rn = Math.floor(Math.random() * 1000) + 1;
        const rn2 = Math.floor(Math.random() * 50) + 2;
        return rn * rn2;
    }
};

module.exports = kgs;