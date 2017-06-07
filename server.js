// call the packages we need
var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    routes = require('./app/bank'),
    mongoose = require('mongoose'),
    Account = require('./app/data/AccountModel'),
    verifyToken = require('./app/utils/verifyToken'),
    authorizeForAccount = require('./app/utils/authorizeForAccount');

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

router.get('/account/:number', verifyToken, function(req, res){
  routes.retrieveAccountInfo(req, res);
});

router.post('/deposit', verifyToken, function(req, res) {
  routes.deposit(req, res);
});

router.post('/transfer', verifyToken, function(req, res) {
  routes.transfer(req, res)
});

router.post('/withdraw', verifyToken, authorizeForAccount, function(req, res){
  routes.withdraw(req, res);
});

router.post('/signup', function(req, res){
  routes.signup(req, res);
});

router.post('/login', function(req, res){
  routes.login(req, res);
});

// Define all of our ROUTES
app.use('/banker', router)

app.listen(port)
console.log('Server started on port ' + port)

module.exports = app;

