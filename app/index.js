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
var config = require('./lib/config');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./lib/handler');
const helpers = require('./lib/helpers');



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


      // data to send to the response handler
      var data = {
            'path' : trimmedPath,
            'queryStringObject' : queryString,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
      };

      var requestHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.default;


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


// Defining a route variable
var router = {
  'ping' : handlers.ping,
  'users' : handlers.users
}
