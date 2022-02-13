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

router.post('/check-login-user', (req, res) => {
    /**
     * もらえるデータ
     *  email, password
     */
    console.log("Check Login User");
    CheckLoginUserFunction(res, req.body);

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
     console.log("requestBody" + requestBody.email);
    const request = new Request(`SELECT MailAddress FROM UserInfo WHERE MailAddress='${requestBody.email}';`, function(err) {  
        // Requestが失敗した場合
        console.log("request:" + request.rowCount);
        if (err) {  
            console.log("error in request");
            console.log(err);
            response.status(500).send('Something broke!');
        }
    });  
    // let emailList = [];
    let emailCnt =0;
    request.on('doneInProc', function (rowCount, more, rows) {
        console.log("Check connected!");
        // 結果データーをemailListに入れる
           emailCnt = rowCount;
    });
    request.on('requestCompleted', function () {
        console.log("Check completed❶!");
        // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
            if(emailCnt=== 0) {
                InsertUserFunction(response, requestBody.firstName, requestBody.lastName,
                    requestBody.email, requestBody.password);
        }
        else {
            response.status(400).send('Already Registered Email');
        }
    });
    connection.execSql(request);
}  

/**  
 *  ユーザーメール確認
 *  @param {string} email
 *  @param {string} password
 */
 function CheckLoginUserFunction(response, requestBody)  {  
   const request = new Request(`SELECT MailAddress, FamilyName, FirstName FROM UserInfo WHERE MailAddress='${requestBody.email}' AND Password='${requestBody.password}';`, function(err) {  
       // Requestが失敗した場合
       if (err) {  
           console.log("error in request");
           console.log(err);
           response.status(500).send('Something broke!');
       }
   });  
   let emailCnt = 0;
   let emailList = [];
   request.on('doneInProc', function (rowCount, more, rows) {
       console.log("Check connected!");
       // 結果データーをemailListに入れる
       emailCnt = rowCount;
       emailList = rows;
   });
   request.on('requestCompleted', function () {
       console.log("Check Mail completed!");
       // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
       if(emailCnt === 0) {
        console.log("Uncorrect Email or PassWord!");
        response.status(500).send('Uncorrect Email or PassWord');
    }
    else {
        const resultData = {
            email: emailList[0][0].value.trim(),
            familyName: emailList[0][1].value.trim(),
            firstName: emailList[0][2].value.trim(),
        }
        response.status(200).json(resultData);
    }
    });
   connection.execSql(request);
}  

module.exports = router;