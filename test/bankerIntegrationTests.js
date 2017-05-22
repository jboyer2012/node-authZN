var request = require('supertest');
var should = require('should');
var Account = require('../app/data/AccountModel');
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
        Account.findOne({ accountNumber: "123456" }, function(err, account){
            if(err){
                console.log('Error: ' + err);
            }
            account.setAccountBalance(500);
            account.save(function(err){
                if(err){
                    console.log('Error: ' + err);
                }
            });
        });
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
        Account.findOne({ accountNumber: "434545" }, function(err, account){
            if(err){
                console.log('Error: ' + err);
            }
            account.setAccountBalance(1000);
            account.save(function(err){
                if(err){
                    console.log('Error: ' + err);
                }
            });
        });
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

describe('POST to transfer money', function(){
    afterEach(function(){
        Account.findOne({ accountNumber: "123456" }, function(err, account){
            if(err){
                console.log('Error: ' + err);
            }
            account.setAccountBalance(500);
            account.save(function(err){
                if(err){
                    console.log('Error: ' + err);
                }
            });
        });

        Account.findOne({ accountNumber: "434545" }, function(err, account){
            if(err){
                console.log('Error: ' + err);
            }
            account.setAccountBalance(1000);
            account.save(function(err){
                if(err){
                    console.log('Error: ' + err);
                }
            });
        });
    });

    it('should transfer the correct amount', function(done){
        var postData = { "fromNumber": "434545", "toNumber": "123456", "amount": 500 },
            expectedResult = { 
                accountTransferredFrom: "434545",
                accountTransfferedTo: "123456",
                amountTransferred: 500,
                fromAccountNewBalance: 500,
                toAccountNewBalance: 1000
            };
        request(appUnderTest)
            .post('/banker/transfer')
            .send(postData)
            .set('Accept', 'application/json')
            .expect(expectedResult, done);
    });
});