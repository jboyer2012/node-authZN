var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username           : String,
    password           : String,
    authorizedAccounts : [String],
});

// methods ======================
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// expose the model to the rest of the app
module.exports = mongoose.model('User', userSchema);