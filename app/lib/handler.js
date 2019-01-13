/*
*
* Request Handlers
*
*/

// dependencies
const _data = require('./data');
const helpers = require('./helpers');


// Defining the handlers
var handlers ={}

// Users handler
handlers.users= function (data,callback){
  var acceptedMethods = ['get','post','put','delete'];
  if(acceptedMethods.indexOf(data.method) > -1){
    handlers._user[data.method](data,callback);
  } else {
    callback(405);
  }
}

// Container for the user submethods
handlers._user= {};

// Users -post
handlers._user.post = function(data,callback) {
  if(typeof(data.payload) == 'object'){
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var streetAddress = typeof(data.payload.streetAddress) == 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement ? true : false;

      if(firstName && lastName && password && email && streetAddress && tosAgreement){
      console.log(_data);
      _data.read('users',email,function(err,data){
        if(err){
          // Hash the password
          var hashedPassword = helpers.hash(password);
            if(hashedPassword){
            // Create the userObj for storing
            var userObj = {
              'firstName' : firstName,
              'lastName' : lastName,
              'phone' : phone,
              'email' : email,
              'streetAddress' : streetAddress,
              'tosAgreement' : tosAgreement,
              'hashedPassword' : hashedPassword
            }
            _data.create('users',email,userObj,function (err) {
              if(!err){
                callback(200);
              } else {
                callback(500,{'Error' : 'Could not create the new user'});
              }
            });
            } else {
                callback(500,{'Error' : 'Could not hash the users password'});
            }
          } else {
            callback(400,{'Error' : 'User with that email already exists'});
          }
        });
    } else {
      callback(400,{'Error' : 'Missing required fields'});
    }
  } else {
    console.log(data);
    callback(400,{'Error' : 'Missing payload'});
  }
}


// Users -get
// Required data : email
// Optional data : none
// TODO: Authentication
handlers._user.get = function(data,callback) {
  var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
  if(email){
    //lookup the users
    _data.read('users',email,function(err,data) {
      if(!err && data){
        // Remove the hashed Password before returning it
        delete data.hashedPassword;
        callback(200,data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required fields'});
  }
}


// Users -put
// Required : email
// Optional : firstName,lastName,password (Atleast one must be specified)
// TODO: Authentication
handlers._user.put = function(data,callback) {

    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var streetAddress = typeof(data.payload.streetAddress) == 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim() : false;

    //validate email
    if(email){
      //Check if atleast one is present
      if(firstName || lastName || phone || password){
        //Read the user data
        _data.read('users',email,function(err,userData) {
          if(!err && userData){
            //Update provided fields
            if(firstName){
              userData.firstName = firstName;
            }
            if(lastName){
              userData.lastName = lastName;
            }
            if(phone){
              userData.phone = phone;
            }
            if(password){
              userData.password = password;
            }
            if(streetAddress){
              userData.streetAddress = streetAddress;
            }

            //Update the users data
            _data.update('users',email,userData,function(err) {
              if(!err){
                callback(200);
              } else {
                console.log(err);
                callback(500,{'Error':'Could not update user data'});
              }
            });
          } else {
            callback(400,{'Error':'Could not find the specified user'});
          }
        });
      } else {
        callback(400,{'Error' : 'Missing fields for update'});
      }
    } else {
      callback(400,{'Error' : 'Missing required fields'});
    }

}


// Users -delete
// Required : email
// TODO: Authentication
// TODO: Cleanup any other data file associated with user
handlers._user.delete = function(data,callback) {
  //check if email is valid

    var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
    if(email){
      //lookup the user
      _data.read('users',email,function(err,data) {
        if(!err && data){
          // Delete the user file
          _data.delete('users',email,function(err) {
            if(!err){
              callback(200);
            } else {
              console.log(err);
              callback(500 , {'Error':'Could not delete the specified user'});
            }
          })

        } else {
          callback(400,{'Error':'Could not find the specified user`'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required fields'});
    }
}

// Default 404 Handler

handlers.default = function (data,callback) {
  //callback a statusCode
  callback(404);
}

// Ping Handler

handlers.ping = function (data,callback) {
  callback(200);
}


//Exporting the handler
module.exports = handlers;
