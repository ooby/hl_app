const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const busboy = require('connect-busboy');

const mongoose = require('./libs/mongoose');

const http = require('http');
const app = express();
const server = http.createServer(app);

app.use(busboy({
    highWaterMark: 2 * 1024 * 1024
}));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(morgan('tiny'));

const router = require('./router')(express, busboy);
app.use('/api', router);

app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    } else {
        res.status(err.status).json({ message: err.message });
    }
});

const port = 3000;
server.listen(port, function (e) {
    if (e) { console.log(e); }
    else { console.log('listening on port', port); }
});
module.exports = app;