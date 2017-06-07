var User = require('../data/UserModel');

module.exports = function(req, res, next){
    var fromAccountNumber = req.body.fromNumber;
    var toAccountNumber = req.body.toNumber;
    var username = req.decoded.username;

    User.findOne({ 'username': username }, function(err, user){

        if(err){
            throw err;
        }

        if(user.authorizedAccounts.indexOf(fromAccountNumber) === -1 ||
           user.authorizedAccounts.indexOf(toAccountNumber) === -1){
               res.status(403).json({ message: "Not authorized for this account"});
           } else {
               next();
           }

    });
};