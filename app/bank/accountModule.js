var accounts = require('./accountRepository').accounts;

module.exports = {

    retrieveBalance: function(numberToFind){

        for(var i = 0; i < accounts.length; i++){
            if(accounts[i].accountNumber === numberToFind){
                return accounts[i].balance;
            }
        }

        return "No matching account.";
    },

    depositFunds: function(accountNumber, amount){
        for(var i = 0; i < accounts.length; i++){
            var currAccount = accounts[i];
            if(currAccount.accountNumber === accountNumber){
                currAccount.balance = currAccount.balance + amount;
                return currAccount.balance;
            }
        }

        return "No matching account.";
    },

    redeem: function(accountNumber, amount){
        for(var i = 0; i < accounts.length; i++){
            var currAccount = accounts[i];
            if(currAccount.accountNumber === accountNumber){
                currAccount.balance = currAccount.balance - amount;
                return currAccount.balance;
            }
        }

        return "No matching account";
    },

    transferFunds: function(fromAccountNumber, toAccountNumber, amount){
        var fromAccount, toAccount;
        for(var i = 0; i < accounts.length; i++){
            var currAccount = accounts[i];
            if(currAccount.accountNumber === fromAccountNumber){
                fromAccount = currAccount;
            }
        }

        for(var i = 0; i < accounts.length; i++){
            var currAccount = accounts[i];
            if(currAccount.accountNumber === toAccountNumber){
                toAccount = currAccount;
            }
        }

        fromAccount.balance = fromAccount.balance - amount;
        toAccount.balance = toAccount.balance + amount;
    },

    setBalance: function(accountNumber, newBalance){
        for(var i = 0; i < accounts.length; i++){
            var currAccount = accounts[i];
            if(currAccount.accountNumber === accountNumber){
                currAccount.balance = newBalance;
            }
        }
    }
};