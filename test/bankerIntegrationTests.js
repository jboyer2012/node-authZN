var request = require('supertest');
var should = require('should');
var Account = require('../app/data/AccountModel');
var User = require('../app/data/UserModel');
var appUnderTest = require('../server');

describe('POST to login to the application', function() {
    before(function(done){
        var user = new User();
        user.email = "user@user.com"
        user.password = user.generateHash("pass11");

        user.save(done);
    });
    it('should return success', function(done){
        var loginData = { "email": "user@user.com", "password": "pass11" };
        request(appUnderTest)
            .post('/banker/login')
            .send(loginData)
            .expect(200, done);
    });
});

describe('GET to retrieve an account balance', function(){
    it('should return the account balance', function(done){
        request(appUnderTest)
            .get('/banker/account/123456')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"accountBalance":500}', done);
    });
});

describe('Transactions that require authentication', function(){
    var token = '';
    before(function(done){
        var loginData = { "email": "user@user.com", "password": "pass11" };
        request(appUnderTest)
            .post('/banker/login')
            .send(loginData)
            .expect(function(res){
                token = res.body.token;
            })
            .expect(200, done);
    });

    it('should deposit the correct amount', function(done){
        var postData = { "number": "123456", "amount": 300.00, "token": token };
        request(appUnderTest)
            .post('/banker/deposit')
            .send(postData)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"newBalance":800}', done);
    });

    it('should withdraw the correct amount', function(done){
        var postData = { "number": "434545", "amount": 300.00, "token": token };
        request(appUnderTest)
            .post('/banker/withdraw')
            .send(postData)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('{"newBalance":700}', done);
    });

    it('should transfer the correct amount', function(done){
        var postData = { "fromNumber": "434545", "toNumber": "123456", "amount": 500, "token": token },
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

    after(function(){
            User.remove({ 'email': 'user@user.com'}, function(err){
                if(err){
                    throw err;
                }
            });
    });

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
});