var request = require('supertest');
var should = require('should');
var accountModule = require('../app/bank/accountModule');
var appUnderTest = require('../server');

describe('GET to retrieve an account balance', function(){
    it('should return the account balance', function(done){
        request(appUnderTest)
            .get('/banker/account/123456')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"accountBalance":500}', done);
    });
});

describe('POST to deposit money', function(){
    afterEach(function(){
        accountModule.setBalance("123456", 500);
    });
    it('should add the correct amount to the balance', function(done){
        var postData = { "number": "123456", "amount": 300.00 };
        request(appUnderTest)
            .post('/banker/deposit')
            .send(postData)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"newBalance":800}', done);
    });
});

describe('POST to redeem money', function(){
    afterEach(function(){
        accountModule.setBalance("434545", 1000);
    });

    it('should redeem the correct amount', function(done){
        var postData = { "number": "434545", "amount": 300.00 };
        request(appUnderTest)
            .post('/banker/redeem')
            .send(postData)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"newBalance":700}', done);
    });
});

/*describe('POST to transfer money', function(){
    afterEach(function(){
        accountModule.setBalance("123456", 500);
        accountModule.setBalance("434545", 1000);
    });

    it('should transfer the correct amount', function(done){
        var postData = { "fromNumber": "434545", "toNumber": "123456", "amount": 500 };
        request(appUnderTest)
            .post('/banker/transfer')
            .send(postData)
            .set('Accept', 'application/json')
            .expect(200);

        // check new balances
        request(appUnderTest)
            .get('/banker/account/123456')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"accountBalance":1000}');

        request(appUnderTest)
            .get('/banker/account/434545')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"accountBalance":500}', done);
    });
});*/