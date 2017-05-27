var LocalStrategy = require('passport-local').Strategy;
var User = require('../data/UserModel');

module.exports = function(passport){
// Passport needs to serialize and unserialize users out of session
// This code sets that up to allow persistent login sessions

// serialize the user
passport.serializeUser(function(user, done){
    done(null. user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

// Local signup strategy allows for registration of users

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
function(req, email, password, done) {
    
    process.nextTick(function(){

        // find a user whose email is the same as the email entered
        // checking if the user already exists
        User.findOne({ 'local.email' : email }, function(err, user){

            if(err) {
                return done(err);
            }

            if(user) {
                return(done(null, false, "That email is already taken."));
            } else {
                var newUser = new User();

                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
            }

            newUser.save(function(err){
                if(err) {
                    throw err;
                }
                return done(null, newUser);
            });

        })
    })
}));

passport.use('local-login', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
function(req, email, password, done) {
    User.findOne({ 'local.email' : email }, function(err, user){
        if(err){
            return done(err);
        }

        if(!user) {
            return done(null, false, "Login incorrect");
        }

        if(!user.validPassword(password)) {
            return done(null, false, "Login incorrect");
        }

        return done(null, user);
    });
}));

};