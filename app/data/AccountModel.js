var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({

    accountNumber: String,
    balance: Number,

});

accountSchema.methods.addToAccount = function(amount) {
    this.balance = this.balance + amount;
    return this.balance;
};

accountSchema.methods.subtractFromAccount = function(amount) {
    if(this.balance - amount < 0){
        this.balance = 0;
    }
    this.balance = this.balance - amount;
    return this.balance;
};

accountSchema.methods.setAccountBalance = function(newBalance) {
    this.balance = newBalance;
}


// expose model to the rest of the app
module.exports = mongoose.model('Account', accountSchema);