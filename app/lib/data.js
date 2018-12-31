/*
*
* File for handling all CRUD operations for data in the API
*
*
*/

// Getting required dependencies

const fs = require('fs');
const path = require('path');


// Container for the module

var lib = {};

// Getting base directory for data Storage
// NTS : dirname has 2 underscores
lib.baseDir = path.join(__dirname,'/../.data/');

// Create and write data to a File
lib.create = function (dir,file,data,callback) {
 // Open the File
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor) {
    if(!err && fileDescriptor){
      // Convert data to string
      var dataString  = JSON.stringify(data);
      // Write string data to File
      fs.writeFile(fileDescriptor,dataString,function(err) {
        if(!err){
          // Close the file
          fs.close(fileDescriptor,function(err) {
            if (!err) {
              // Return false if no error has occured
              callback(false);
            } else {
              callback('Error while closing file');
            }
          });
        } else {
          callback('Error while writing into file');
        }
      });

    } else {
        callback('Could not create File it may already exist')
    }
  });
};

// Read data from File
lib.read = function(dir,file,callback){
  //Read file
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data) {
    callback(err,data);
  });
};

// Update the File
lib.update = function(dir,file,data,callback){
  //Read file
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor) {
    if(!err && fileDescriptor){

      // Convert data into String
      var dataString = JSON.stringify(data);
      // Write string data in file
      fs.writeFile(fileDescriptor,dataString,function (err) {
        if(!err && fileDescriptor){
          fs.close(fileDescriptor,function (err) {
            if(!err){
              callback(false);
            } else {
              callback('Error occured while closing existing file')
            }
          })
        } else {
          callback('Error occured while updating to existing file');
        }
      });
    } else {
      callback('Error while opening existing file')
    }
  });
};

// Delete file
lib.delete = function(dir,file,callback) {
  // Unlink the file
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err) {
    if(!err){
      callback(false);
    } else {
      callback('Error occured while deleting file');
    }
  });
};

// Export the module
// NTS : it's exports not export
module.exports = lib;
