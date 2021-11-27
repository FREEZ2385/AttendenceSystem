var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send({test: 'hello World!'})
})
const connection = require('../sqlconnect');
router.post('/insert-user', (req, res) => {
    /**
     * もらえるデータ
     * firstName, lastName, email, password
     */
    res.set('Access-Control-Allow-Origin', '*');
    connection.on("connect", err => {
         if (err) {
         console.error(err.message);
         } else {
         console.log("connected!");
         InsertUserFunction(req.body.firstName, req.body.lastName,
            req.body.email, req.body.password);
         }
     });
    res.status(201)
    })

var Request = require('tedious').Request  
var TYPES = require('tedious').TYPES;  

function InsertUserFunction(firstName, lastName, email, password) {  
    const request = new Request("INSERT dbo.UserInfo (FirstName, FamilyName, MailAddress, Password);", function(err) {  
        if (err) {  
        console.log(err);}  
    });  
    request.addParameter('FirstName', TYPES.NVarChar,firstName);  
    request.addParameter('FamilyName', TYPES.NVarChar , lastName);  
    request.addParameter('MailAddress', TYPES.NVarChar , email);  
    request.addParameter('Password', TYPES.NVarChar ,password);  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
            if (column.value === null) {  
            console.log('NULL');  
            } else {  
            console.log("Product id of inserted item is " + column.value);  
            }  
        });  
    });

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(request);  
}  
module.exports = router;