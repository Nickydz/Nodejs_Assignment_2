/*
*
* Helpers for various tasks
*
*/

// Dependencies
const crypto = require('crypto');
var config = require('./config');

// Container for all the Helpers
var helpers = {};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256',config.hashPassCode).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}


// Parse a JSON string to an object without throwing an exception
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    console.log(e);
    return {};
  }
}

// Export the module
module.exports = helpers;
