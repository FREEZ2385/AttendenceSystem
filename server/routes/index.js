/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send({test: 'hello World!'})
})

var connection = require('../sqlconnect');
var Request = require('tedious').Request  
var TYPES = require('tedious').TYPES;  

/**  
 *  DB接続
 */
connection.connect();
connection.on("connect", () => {
    console.log("DB Connected!");
});


router.post('/insert-user', (req, res) => {
    /**
     * もらえるデータ
     * firstName, lastName, email, password
     */
    console.log("Insert Connecting");
    CheckUserEmailFunction(res, req.body);

})

/**  
 *  ユーザー登録
 *  @param {string} firstName
 *  @param {string} lastName
 *  @param {string} email
 *  @param {string} password
 */
function InsertUserFunction(response, firstName, lastName, email, password) {  
    const request = new Request("INSERT INTO UserInfo (FirstName,FamilyName,MailAddress,Password) VALUES (@FirstName,@FamilyName,@MailAddress,@Password);", function(err) {  
        if (err) {  
            console.log("error in request");
            console.log(err);
            response.status(500).send('Something broke!');
        }  
        else {
            response.status(200).send('Success');
        }
    });  
    request.addParameter('FirstName', TYPES.NVarChar, firstName);  
    request.addParameter('FamilyName', TYPES.NVarChar , lastName);  
    request.addParameter('MailAddress', TYPES.NVarChar , email);  
    request.addParameter('Password', TYPES.NVarChar ,password);  

    request.on('requestCompleted', function () {
        console.log("Insert completed!");
    });
    connection.execSql(request);  
}  

/**  
 *  ユーザーメール確認
 *  @param {string} email
 */
 function CheckUserEmailFunction(response, requestBody)  {  
    const request = new Request(`SELECT MailAddress FROM UserInfo WHERE MailAddress='${requestBody.email}';`, function(err) {  
        // Requestが失敗した場合
        if (err) {  
            console.log("error in request");
            console.log(err);
            response.status(500).send('Something broke!');
        }
    });  
    let emailList = [];
    request.on('doneInProc', function (rowCount, more, rows) {
        console.log("Check connected!");
        // 結果データーをemailListに入れる
        emailList = rows;
    });
    request.on('requestCompleted', function () {
        console.log("Check completed!");
        // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
        if(emailList.length === 0) {
            InsertUserFunction(response, requestBody.firstName, requestBody.lastName,
                requestBody.email, requestBody.password);
        }
        else {
            response.status(400).send('Already Registered Email');
        }
    });
    connection.execSql(request);
}  

module.exports = router;