var jwt = require('jsonwebtoken');
var constants = require('../config/constants');

module.exports = function(payload, expiresIn){
    return jwt.sign(payload, constants.SECRET, {expiresIn });
}