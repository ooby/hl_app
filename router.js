const Account = require('./models/account');
const jwt = require('jsonwebtoken');
const config = require('./config');
const error = require('./libs/error');
const router = express => {
    let r = express.Router();
    r.post('/login', (req, res, next) => {
        let { email, password } = req.body;
        if (!email || !password) { next(error(401, 'BAD_REQUEST')) }
        else {
            Account.authorize(email, password, (e, r) => {
                if (e) { next(e); }
                else {
                    let token = jwt.sign(acc._id, config.get("secret"));
                    res.status(200).json({ message: 'OK', token: token });
                }
            });
        }
    });
    return r;
};
module.exports = router;