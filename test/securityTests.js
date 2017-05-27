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
});

