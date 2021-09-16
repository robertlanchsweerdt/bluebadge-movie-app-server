require('dotenv').config();
const Express = require('express');
const app = Express();
const dbConnection = require('./db');
app.use(require("./middleware/headers"));
const controllers = require("./controllers")
app.use(Express.json());
app.use("/user", controllers.userController);
app.use("/movie", controllers.movieController);


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