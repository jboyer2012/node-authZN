var accountModule = require('../app/bank/accountModule');
var should = require('should');

describe('Retrieve balance from account module', function(){
    it('should return the balance of the account', function(){
       var accountNumber = "123456";

       var balance = accountModule.retrieveBalance(accountNumber);

       balance.should.equal(500.00);

    });
});

describe('Deposit money to account', function(){
    it('should add the correct amount to the balance', function(){
        var accountNumber = "123456";
        var amountToDeposit = 350.00;

        var newBalance = accountModule.depositFunds(accountNumber, amountToDeposit);

        newBalance.should.equal(850.00)
    });

    it('should return error message when no account matches', function(){
        var accountNumber = "999999";
        var amountToDeposit = 350.00;

        var newBalance = accountModule.depositFunds(accountNumber, amountToDeposit);

        newBalance.should.equal('No matching account.');
    });
});

describe('Redeem money from an account', function(){

    it('should subtract the correct amount from the balance', function(){
        var accountNumber = "434545";
        var amountToRedeem = 300.00;

        var newBalance = accountModule.redeem(accountNumber, amountToRedeem);

        newBalance.should.equal(700.00);
    });
});

describe('Transfer money from one account to another', function(){
    afterEach(function(){
        accountModule.setBalance("123456", 500.00);
        accountModule.setBalance("434545", 1000.00);
    });

    it('should transfer the correct amount', function(){
        var fromBalanceBefore, toBalanceBefore, fromBalanceAfter, toBalanceAfter;
        var fromAccount = "434545";
        var toAccount = "123456";
        var amount = 400.00;

        fromBalanceBefore = accountModule.retrieveBalance(fromAccount);
        toBalanceBefore = accountModule.retrieveBalance(toAccount);

        accountModule.transferFunds(fromAccount, toAccount, amount);

        fromBalanceAfter = accountModule.retrieveBalance(fromAccount);
        toBalanceAfter = accountModule.retrieveBalance(toAccount);

        fromBalanceAfter.should.equal(fromBalanceBefore - amount);
        toBalanceAfter.should.equal(toBalanceBefore + amount);

        
    });
});
