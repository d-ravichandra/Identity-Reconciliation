const dba = require('./DBController/dba');
const responseServiceInstance = require('./ResponseService');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/identify', (req, res) => {
    const email = req.body.email;
    const phone = req.body.phone;
    try {
        if(email === null && phone === null) {
            res.send("Invalid request");
        } else {
            dba.process(email, phone).then(records => {
                responseServiceInstance.response(records).then((result) => {
                    res.send(JSON.stringify(result));
                });
            });
        }
    } catch(error) {
        console.error('error occured: ', error);
    }    

});

app.listen(port, () => {
    dba.connect();
    console.log(`App listening at http://localhost:${port}`);
});
