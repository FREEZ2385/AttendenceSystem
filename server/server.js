var express = require('express');
const app = express();
const api = require('./routes');

app.use('/api', api);

const port = 3002;



app.listen(port, ()=>{
    const connection = require('./sqlconnect');
    connection.on("connect", err => {
        if (err) {
        console.error(err.message);
        } else {
        console.log("connected!");
        }
    });
        
    connection.connect();
});
