var User = require('../data/UserModel');

module.exports = function(req, res, next){
    var accountNumber = req.params.number || req.body.number;
    var username = req.decoded.username;

    User.findOne({ 'username': username }, function(err, user){

        if(err){
            throw err;
        }

        if(user.authorizedAccounts.indexOf(accountNumber) === -1){
            res.status(403).json({ message: "Not authorized for this account"});
        } else {
            next();
        }
    });
};