var accountModel = require('../app/data/AccountModel');
var should = require('should');

describe('Account Model transactions', function(){
    it('should add funds for a deposit', function(){
        var testAccount = new accountModel();
        testAccount.accountNumber = "123456";
        testAccount.balance = 500;

        testAccount.addToAccount(300);

        testAccount.balance.should.equal(800);
    });

    it('should subtract funds for a redemption', function(){
        var testAccount = new accountModel();
        testAccount.accountNumber = "434545";
        testAccount.balance = 1000;

        testAccount.subtractFromAccount(400);

        testAccount.balance.should.equal(600);
    });
});