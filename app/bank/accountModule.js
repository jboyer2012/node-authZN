var accounts = require('./accountRepository').accounts;


module.exports = {

    retrieveBalance: function(numberToFind){
        
        
    },

    depositFunds: function(accountNumber, amount){  
        var account = Account.find({ accountNumber: accountNumber });

        account.addToAccount(amount);

        return account.balance;
    },

    redeem: function(accountNumber, amount){
         var account = Account.find({ accountNumber: accountNumber });

         account.subtractFromAccount(amount);

         return account.balance;
    },

    transferFunds: function(fromAccountNumber, toAccountNumber, amount){
        var fromAccount = Account.find({ accountNumber: fromAccountNumber });
        var toAccount = Account.find({ accountNumber: toAccountNumber });

        fromAccount.subtractFromAccount(amount);
        toAccount.addToAccount(amount);
    },

    setBalance: function(accountNumber, newBalance){
        var account = Account.find({ accountNumber: accountNumber });

        account.setAccountBalance(newBalance);
    }
};