/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express');
const app = express();
const api = require('./routes');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/api', api);

const port = 3002;



app.listen(port, ()=>{
    console.log("Server Connected!");
});
