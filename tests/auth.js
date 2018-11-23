process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

const server = require('..');
const Account = require('../models/account');

describe('Auth test', () => {
    before(async () => {
        try {
            await Account.remove({});
            let a = new Account({
                email: 'email@mail.ru',
                password: 'obanabana'
            });
            await a.save();
        } catch (e) { console.error(e); }
    });

    after(async () => {
        try {
            await Account.remove({});
        } catch (e) { console.error(e); }
    });

    describe('[POST] /api/login > ', () => {
        it('account login', done => {
            const body = {
                email: 'email@mail.ru',
                password: 'obanabana'
            };
            chai.request(server)
                .post('/api/login')
                .send(body)
                .then(r => {
                    r.should.have.status(200);
                    r.body.should.have.property('message');
                    r.body.should.have.property('token');
                    done();
                })
                .catch(e => {
                    console.error('ERROR', e.status, e.message);
                    return;
                });
        });
    });
});