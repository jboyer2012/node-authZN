var jwt = require('jsonwebtoken');
var constants = require('../config/constants');

// This is middleware that is used to verify the token

module.exports = function(req, res, next){
    // check header or post parameters for token
    var token = req.body.token || req.headers['x-access-token'];

    // decode token
    if (token){
        jwt.verify(token, constants.SECRET, function(err, decoded){
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {

        // if there is no token
        // return an error
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
    }
}