// call the packages we need
var express    = require('express')
var app        = express()
var bodyParser = require('body-parser')
var routes = require('./app/bank')
var mongoose = require('mongoose')
var Account = require('./app/data/AccountModel')
var passport = require('passport')
require('./app/config/passport')(passport)



// route middleware to ensure that the user is logged in 
// before giving access to protected areas of the API
function isLoggedIn(req, res, next) {

  if(req.isAuthenticated()){
    return next();
  }

  res.send(401);
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 3000

// ROUTING
var router = express.Router()

mongoose.connect('mongodb://localhost/auth_zn')

var db = mongoose.connection;
db.on('open', function(){
  console.log("Connected to mongodb");
});

router.get('/account/create', function(req, res){
  routes.createAccount(req, res);
});

router.get('/account/:number', function(req, res){
  routes.retrieveAccountInfo(req, res);
});

router.post('/deposit', function(req, res) {
  routes.deposit(req, res);
});

router.post('/transfer', function(req, res) {
  routes.transfer(req, res)
});

router.post('/withdraw', isLoggedIn, function(req, res){
  routes.withdraw(req, res);
});

router.post('/signup', function(req, res, next){
  passport.authenticate('local-signup', function(err, user, info){
    if (err) { return next(err); }

    if(!user) { res.json({ message: "failure" }); }

    req.logIn(user, function(err){
      res.json({ message: "success" });
    });
  })(req, res, next);
});

router.post('/login', function(req, res, next){
  passport.authenticate('local-login', function(err, user, info){
    if (err) { return next(err); }

    if(!user) {res.json({ message: "login failure"}); }

    req.logIn(user, function(err){
      res.json({ message: "login successful "});
    });
  })(req, res, next);
});

// Define all of our ROUTES
app.use('/banker', router)

app.listen(port)
console.log('Server started on port ' + port)

module.exports = app;

