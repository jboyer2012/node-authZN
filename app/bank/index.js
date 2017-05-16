var accountModule = require('./accountModule');

module.exports = {

    retrieveAccountInfo: function(req, res) {
        var accountNumber = req.params.number;
        var balance = accountModule.retrieveBalance(accountNumber); 

        res.json({ accountBalance: balance });
    },

    deposit: function(req, res) {
        var accountNumber = req.body.number;
        var amount = req.body.amount;

        var newBalance = accountModule.depositFunds(accountNumber, amount);

        res.json({ newBalance: newBalance});
    },

    redeem: function(req, res){
        var accountNumber = req.body.number;
        var amount = req.body.amount;

        var newBalance = accountModule.redeem(accountNumber, amount);

        res.json({ newBalance: newBalance });
    }

    /*transfer: function(req, res) {
        var fromAccountNumber = req.body.fromNumber;
        var toAccountNumber = req.body.toNumber;
        var amount = req.body.amount;

        accountModule.transferFunds(fromAccountNumber, toAccountNumber, amount);

        res.send(200);
    }*/

};