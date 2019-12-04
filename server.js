require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const logger = require('./config/logger');
const routes = require('./routes/routes');
const fs = require('fs')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.use('/', routes);

let init = () => {
    fs.exists('temp', exists => {
        if (!exists) {
            console.log('INFO: '+ 'temp directory created for storing temporary files.')
            fs.mkdirSync('temp');
        }
    });
}

app.listen(process.env.PORT, () => {
    logger.info(`Server is listening to ${process.env.PORT}`);
    init();
})