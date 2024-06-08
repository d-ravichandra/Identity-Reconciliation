const dba = require('./DBController/dba');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/identify', (req, res) => {
    const email = req.body.email;
    const phone = req.body.phone;

    if(email === null && phone === null) {
        res.send("Invalid request");
    } else {
        console.log(`email: ${email}`);
        console.log(`phone: ${phone}`);
        dba.create(email, phone);
        res.send("Querying the database");
    }

});

app.listen(port, () => {
    dba.connect();
    console.log(`App listening at http://localhost:${port}`);
});
