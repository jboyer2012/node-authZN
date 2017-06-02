var request = require('supertest');
var should = require('should');
var Account = require('../app/data/AccountModel');
var appUnderTest = require('../server');

describe('Authentication', function(){
    it('should not allow unauthenticated users to withdraw funds', function(done){
        var postData = { "number": "434545", "amount": 300.00 };
        request(appUnderTest)
            .post('/banker/withdraw')
            .send(postData)
            .set('Accept', 'application/json')
            // no authentication complete, so request should fail
            .expect(401, done);
    });

    it('should not allow unauthenticated users to deposit funds', function(done){
        var postData = { "number": "434545", "amount": 400.00 };
        request(appUnderTest)
            .post('/banker/deposit')
            .send(postData)
            .expect(401, done);
    });

    it('should not allow unauthenticated users to request a balance', function(done){
        request(appUnderTest)
            .get('/banker/account/123456')
            .expect(401, done);
    });

    it('should not allow unauthenticated users to transfer funds', function(done){
        var postData = { "fromNumber": "434545", "toNumber": "123456", "amount": 500 };
        request(appUnderTest)
            .post('/banker/transfer')
            .send(postData)
            .expect(401, done);
    });
});

