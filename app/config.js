/*
*
* Create and export Config variables
*
*/


// Container for environments
var environments ={};

// Staging environment
environments.development ={
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName': 'Development'
}

// Production environment
environments.production ={
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName': 'Production'
}


// Determine the current environment passed from command linez
var curEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check if current env exists or default to development
var environmentToExport = typeof(environments[curEnv]) == 'object' ? environments[curEnv] : environments.development;

// Export the module
module.exports = environmentToExport;
