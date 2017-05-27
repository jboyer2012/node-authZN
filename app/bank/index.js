var Account = require('../data/AccountModel');

module.exports = {

    createAccount: function(req, res){
        var newAccount = new Account();
        newAccount.accountNumber = "897879";
        newAccount.balance = 3000;

        newAccount.save(function(err, newAccount){
            if(err){
                console.log('Error: ' + err);
            }
            res.send(newAccount);
        });
    },

    retrieveAccountInfo: function(req, res) {
        Account.findOne({ accountNumber: req.params.number }, function(err, account){
            if(err){
                console.log('Error: ' + err);
            }
            res.json({ accountBalance: account.balance });
        });
    },

    deposit: function(req, res) {
        Account.findOne({ accountNumber: req.body.number }, function(err, account){
            if(err){
                console.log('Error: ' + err);
            }
            account.addToAccount(req.body.amount);
            account.save(function(err){
                if(err){
                    console.log('Error: ' + err);
                }
            });
            res.json({ newBalance: account.balance });
        });
    },

    withdraw: function(req, res){
        Account.findOne({ accountNumber: req.body.number }, function(err, account){
            if(err){
                console.log('Error: ' + err);
            }
            account.subtractFromAccount(req.body.amount);
            account.save(function(err){
                if(err){
                    console.log('Error: ' + err);
                }
            });
            res.json({ newBalance: account.balance });
        });
    },

    transfer: function(req, res) {
        var fromAccountNumber = req.body.fromNumber;
        var toAccountNumber = req.body.toNumber;
        var amount = req.body.amount;
        var responseObject;

        Account.find({ accountNumber: { $in: [fromAccountNumber, toAccountNumber]}}, function(err, accounts){
            if(err){
                console.log('Error: ' + err);
            }
            var fromAccount, toAccount;
            for(var i = 0; i < accounts.length; i++){
                if(accounts[i].accountNumber === fromAccountNumber){
                    fromAccount = accounts[i];
                }
                if(accounts[i].accountNumber === toAccountNumber){
                    toAccount = accounts[i];
                }
            }

            fromAccount.subtractFromAccount(amount);
            fromAccount.save(function(err){
                if(err){
                    console.log('Error: ' + err);
                }
            });
            toAccount.addToAccount(amount);
            toAccount.save(function(err){
                if(err){
                    console.log('Error: ' + err);
                }
            });
            responseObject = {
                accountTransferredFrom: fromAccountNumber,
                accountTransfferedTo: toAccountNumber,
                amountTransferred: amount,
                fromAccountNewBalance: fromAccount.balance,
                toAccountNewBalance: toAccount.balance
            };
            res.send(responseObject);
        });
    }

};