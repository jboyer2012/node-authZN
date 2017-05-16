// call the packages we need
var express    = require('express')
var app        = express()
var bodyParser = require('body-parser')
var routes = require('./app/bank')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 3000

// ROUTING
var router = express.Router()

router.get('/account/:number', function(req, res){
  routes.retrieveAccountInfo(req, res);
});

router.post('/deposit', function(req, res) {
  routes.deposit(req, res);
});

/*router.post('/transfer', function(req, res) {
  routes.transfer(req, res)
});*/

router.post('/redeem', function(req, res){
  routes.redeem(req, res);
});

// Define all of our ROUTES
app.use('/banker', router)

app.listen(port)
console.log('Server started on port ' + port)

module.exports = app
