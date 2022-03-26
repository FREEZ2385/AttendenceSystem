const config = require('./azureaccount');
const tedious = require('tedious');

const connection = new tedious.Connection(config);  

module.exports = connection;