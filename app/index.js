/*
*
* Primary File for the API
*
* Homework Assignment 1 - Simple Node server that responds to hello request with json response
*
*
*/

var http = require('http');
var https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');




// Create/Instantiate HTTP server
var httpServer = http.createServer(function(req,res){
  unifiedLogic(req,res);
});


//Start listening on HTTP server
httpServer.listen(config.httpPort,function(){
  console.log("Listening on port "+config.httpPort +" on "+config.envName+" mode");
})


// Create/Instantiate HTTPS server
var httpsServerOptions ={
  key : fs.readFileSync('./https/key.pem'),
  cert : fs.readFileSync('./https/cert.pem')
}
var httpsServer = http.createServer(httpsServerOptions,function(req,res){
  unifiedLogic(req,res);
});


//Start listening on HTTPS server
httpsServer.listen(config.httpsPort,function(){
  console.log("Listening on port "+config.httpsPort +" on "+config.envName+" mode");
})


// Defining the handlers
var handlers ={}

// Unified Server Logic for all servers http and https
var unifiedLogic = function (req,res) {

    // get parsedUrl from request
    var parsedUrl = url.parse(req.url,true);

    // get Path from url
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //get Method from request
    var method = req.method.toLowerCase();

   //get Query String parameters
   var queryString = parsedUrl.query;

   //get headers from Request
   var headers = req.headers;

   //get Payload if any
   var decoder = new StringDecoder('utf-8');
   var buffer = '';
   req.on('data',function (data) {
     buffer += decoder.write(data);
   })

   req.on('end',function () {
     buffer += decoder.end();

      console.log("Request recieved at path "+ path + " and by " + method +" method with parameters as ",queryString);

      //console.log("\nHeaders recieved", headers);

      if(buffer == ''){
        console.log('\nEmpty Payload Stream received');
      }else{
        console.log('\nPayload recieved : ', buffer);
      }

      var requestHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.default;

      // data to send to the response handler
      var data = {
        'path' : trimmedPath,
        'queryStringObject' : queryString,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

      requestHandler(data,function(statusCode,payload) {
        statusCode = typeof(statusCode) == 'number' ? statusCode : 500;

        payload = typeof(payload) == 'object' ? payload : {}
        // Convert payload to string
        var payloadStr = JSON.stringify(payload);

        // Set Content Type in header
        res.setHeader('Content-Type','application/json')

        // Set status Code in response header
        res.writeHead(statusCode)

        // send response
        res.end(payloadStr)



      });
    });
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

// Defining a route variable
var router = {
  'ping' : handlers.ping
}
