const err = require('http-errors');
module.exports = (status, message) => err(status, message);