require('dotenv').config();
const Express = require('express');
const app = Express();
const dbConnection = require('./db');
app.use(Express.json());


dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}`);
        });
    })
    .catch((e) => {
        console.log(`[Server]: Server crashed. Error = ${e}`);
    });