const mongoose = require('mongoose');
const config = require('../config');
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'),
    e => {
        if (e) { console.log(e); }
        else { console.log('DB connected to', config.get('mongoose:uri')); }
    });
module.exports = mongoose;