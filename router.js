const Account = require('./models/account');
const Image = require('./models/image');
const jwt = require('jsonwebtoken');
const config = require('./config');
const error = require('./libs/error');
const secret = config.get('secret');
const router = (express, busboy) => {
    let r = express.Router();
    r.post('/login', (req, res, next) => {
        let { email, password } = req.body;
        if (!email || !password) { next(error(401, 'BAD_REQUEST')) }
        else {
            Account.authorize(email, password, (e, acc) => {
                if (e) { next(e); }
                else {
                    let token = jwt.sign({ id: acc._id, email: acc.email }, secret);
                    res.status(200).json({ message: 'OK', token: token });
                }
            });
        }
    });
    r.use((req, res, next) => {
        let token = req.get('x-access-token');
        if (!token) { next(error(400, 'BAD_REQUEST')); }
        else {
            jwt.verify(token, secret, (e, d) => {
                if (e) {
                    console.log('Access token error');
                    next(error(403, 'FORBIDDEN'));
                } else {
                    req.decoded = d;
                    next();
                }
            });
        }
    });
    r.get('/list', (req, res, next) => {
        Image.find({ _account: d.id }, (e, img) => {
            if (e) { next(error(503, 'IMAGE_ERROR')); }
            else {
                let list = img.map(i => {
                    return { uuid: i.uuid, name: i.name, description: i.description };
                })
                res.status(200).json({ message: 'OK', images: list });
            }
        });
    });
    r.post('/upload', (req, res, next) => {
        req.pipe(req.busboy);

        req.busboy.on('file', (fieldname, file, filename) => {
            console.log(`Upload of '${filename}' started`);

            const fstream = fs.createWriteStream(path.join(uploadPath, filename));
            file.pipe(fstream);

            fstream.on('close', () => {
                console.log(`Upload of '${filename}' finished`);
                res.status(200).json({ message: 'OK' });
            });
        });
    });
    return r;
};
module.exports = router;