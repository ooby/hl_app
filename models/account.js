const crypto = require('crypto');
const async = require('async');
const error = require('../libs/error');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    hashedPassword: { type: String, required: true, select: false },
    salt: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

accountSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

accountSchema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha512', this.salt).update(password).digest('hex');
};

accountSchema.statics.authorize = function (email, password, callback) {
    let Account = this;
    let hash = '';
    async.waterfall([
        function (callback) {
            Account.findOne({ email: email }).select('hashedPassword').exec(callback);
        },
        function (acc, callback) {
            if (acc) {
                hash = acc.hashedPassword;
                Account.findOne({ email: email }, callback);
            } else {
                callback(error(404, 'ACCOUNT_NOT_FOUND'));
            }
        },
        function (acc, callback) {
            if (acc) {
                if (acc.encryptPassword(password) === hash) {
                    callback(null, acc);
                } else {
                    callback(error(401, 'WRONG_PASSWORD'));
                }
            } else {
                callback(error(503, 'ACCOUNT_ERROR'));
            }
        }
    ], callback);
};

module.exports = mongoose.model('Account', accountSchema);