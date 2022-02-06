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
        console.log("rowsCount" + rowCount);
        console.log("rows" + rows);
        // 結果データーをemailListに入れる
        // emailList = rowCount;
           emailCnt = rowCount;
        // console.log("EmailLenght❷" + emailList.length);

    });
    request.on('requestCompleted', function () {
        console.log("Check completed❶!");
        // console.log("EmailLenght" + emailList.length);
        // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
        // if(emailList.length === 0) {
            if( emailCnt=== 0) {
            // console.log("EmailLenght(New)" + emailList.length);
            InsertUserFunction(response, requestBody.firstName, requestBody.lastName,
                requestBody.email, requestBody.password);
        }
        else {
            // console.log("EmailLenght(Already)" + emailList.length);
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
   let emailCnt =0;
   request.on('doneInProc', function (rowCount, more, rows) {
       console.log("Check connected!");
       console.log("rows" + rowCount);
       // 結果データーをemailListに入れる
    //    emailList = rowCount;
       emailCnt = rowCount;
   });
   request.on('requestCompleted', function () {
       console.log("Check Mail completed!");
    //    console.log("EmailList" + emailList.length);
       // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
    //    if(emailList.length === 0) {
        if(emailCnt === 0) {
        console.log("Unregister Email!");
        response.status(300).send('Unregister Email');
       }
       else {
        console.log("ELse State");
        const request = new Request(`SELECT Password FROM UserInfo WHERE Password='${requestBody.password}';`, function(err) {  
            // Requestが失敗した場合
            console.log("request:" + request.rowCount);
            if (err) {  
                console.log("error in request");
                console.log(err);
                response.status(500).send('Something broke!');
            }
        });  
        // let emailList = [];
        request.on('doneInProc', function (rowCount, more, rows) {
            console.log("PasswordCheck connected!");
            console.log("Prows" + rowCount);
            // 結果データーをemailListに入れる
            emailCnt = rowCount;
        });
        request.on('requestCompleted', function () {
            console.log("Check completed!");
            // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
            // if(emailList.length === 0) {
                if(emailCnt === 0) {
                console.log("Uncorrect PassWord!");
                response.status(400).send('Uncorrect PassWord');
            }
            else {
                response.status(200).send('Registered User');
            }
        });

   connection.execSql(request); 
}
});
   connection.execSql(request);
}  

module.exports = router;