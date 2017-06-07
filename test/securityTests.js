var request = require('supertest');
var should = require('should');
var Account = require('../app/data/AccountModel');
var User = require('../app/data/UserModel');
var appUnderTest = require('../server');

describe('Authentication', function(){
    it('should not allow unauthenticated users to withdraw funds', function(done){
        var postData = { "number": "434545", "amount": 300.00 };
        request(appUnderTest)
            .post('/banker/withdraw')
            .send(postData)
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

describe('Authorization', function(){
    var token = '';
    before(function(done){
        var user = new User();
        user.username = "auth_user"
        user.password = user.generateHash("pass11");
        user.authorizedAccounts = ["123456"];
        user.save();

        var loginData = { "username": "auth_user", "password": "pass11" };
        request(appUnderTest)
            .post('/banker/login')
            .send(loginData)
            .expect(function(res){
                token = res.body.token;
            })
            .expect(200, done);
    });
    
    it('should not allow a user to withdraw from an unauthorized account', function(done){
        var postData = { "number": "434545", "amount": 500, "token": token };
        request(appUnderTest)
            .post('/banker/withdraw')
            .send(postData)
            .set('Accept', 'application/json')
            .expect(403, done);

    });

    after(function(){
            User.remove({ 'username': 'auth_user'}, function(err){
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

