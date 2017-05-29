var Account = require('../data/AccountModel'),
    User = require('../data/UserModel'),
    createToken = require('../utils/createToken'),
    constants = require('../config/constants');

module.exports = {

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
    },

    signup: function(req, res){
        // find a user whose email is the same as the email entered
        // checking if the user already exists
        User.findOne({ 'email' : req.body.email }, function(err, user){

            if(err) {
                throw err;
            }

            if(user) {
                res.status(400).json({ success: false, message: "Email already taken" });
            } else {
                var newUser = new User();

                newUser.email = email;
                newUser.password = newUser.generateHash(password);
            }

            newUser.save(function(err){
                if(err) {
                    throw err;
                }
                res.status(200).json({ success: true, message: 'User created!' });
            });

        })
    },

    login: function(req, res){
        var email = req.body.email;
        var password = req.body.password;

        User.findOne({ 'email': email }, function(err, user){
            if (err){
                throw err;
            }

            if(!user){
                res.status(400).json({ success: false, message: "Login incorrect" });
            } else if (user) {
                if(!user.validPassword(password)){
                    res.status(400).json({ success: false, message: "Login incorrect" });
                }

                var payload = { email: user.email };
                var token = createToken(payload, constants.TOKEN_EXPIRES_IN);

                res.status(200).json({
                    success: true,
                    message: "Login successful" + user.email,
                    email: user.email,
                    token: token
                });

            }
        });
    }

};