/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express');
const azureFunctionHandler = require('azure-aws-serverless-express');
const createHandler = require('azure-function-express').createHandler;
const app = express();
const api = require('./routes');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use('/api', api);

module.exports = createHandler(app);