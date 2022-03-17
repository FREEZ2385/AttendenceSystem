/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.send({test: 'hello World!'})
})

var connection = require('../../sqlconnect');
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
    console.log("Insert User Connecting");
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

router.post('/check-login-user-no-password', (req, res) => {
    /**
     * もらえるデータ
     *  email, password
     */
    console.log("Check Login User");
    CheckLoginUserNonPasswordFunction(res, req.body);
})

router.post('/get-kindai', (req, res) => {
    /**
     * もらえるデータ
     *  email, password
     */
    console.log("Check Kindai");
    GetAttendenceFunction(res, req.body);
})

router.post('/get-all-kindai', (req, res) => {
    /**
     * もらえるデータ
     *  email, password
     */
    console.log("Check Kindai");
    GetAllAttendenceFunction(res, req.body);
})

router.post('/insert-kindai', (req, res) => {
    /**
     * もらえるデータ
     * firstName, lastName, email, password
     */
    console.log("Insert Kindai Connecting");
    CheckKindaiFunction(res, req.body);

})

/**  
 *  ユーザー登録
 *  @param {string} firstName
 *  @param {string} lastName
 *  @param {string} email
 *  @param {string} password
 */
function InsertUserFunction(response, firstName, lastName, email, password) {  
    const request = new Request("INSERT INTO UserInfo (FirstName,FamilyName,MailAddress,Password,RemainHoliday) VALUES (@FirstName,@FamilyName,@MailAddress,@Password,@RemainHoliday);", function(err) {  
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
    request.addParameter('RemainHoliday', TYPES.Int ,10);  

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
        console.log("Check completed!");
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
   const request = new Request(`SELECT ID, MailAddress, FamilyName, FirstName, RemainHoliday FROM UserInfo WHERE MailAddress='${requestBody.email}' AND Password='${requestBody.password}';`, function(err) {  
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
            id: emailList[0][0].value,
            email: emailList[0][1].value.trim(),
            familyName: emailList[0][2].value.trim(),
            firstName: emailList[0][3].value.trim(),
            remainHoliday: emailList[0][4].value
        }
        CheckUserRemainHolidayFunction(response, resultData)
    }
    });
   connection.execSql(request);
}  

/**  
 *  ユーザーメール確認
 *  @param {string} email
 */
function CheckLoginUserNonPasswordFunction(response, userId)  {  
    const request = new Request(`SELECT ID, MailAddress, FamilyName, FirstName, RemainHoliday FROM UserInfo WHERE ID='${userId}';`, function(err) {  
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
        // 結果データーをemailListに入れる
        emailCnt = rowCount;
        emailList = rows;
    });
    request.on('requestCompleted', function () {
        // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
        if(emailCnt === 0) {
         console.log("Uncorrect Email or PassWord!");
         response.status(500).send('Uncorrect Email or PassWord');
     }
     else {
         const resultData = {
             id: emailList[0][0].value,
             email: emailList[0][1].value.trim(),
             familyName: emailList[0][2].value.trim(),
             firstName: emailList[0][3].value.trim(),
             remainHoliday: emailList[0][4].value
         }
         // ユーザの残有給数まで取得する
         CheckUserRemainHolidayFunction(response, resultData)
     }
     });
    connection.execSql(request);
 }

const getStartEndDatesYear = () =>  {
    var moment = require('moment');
    const startDate = moment().startOf("year").format('YYYY-MM-DD');
    const endDate = moment().endOf("year").format('YYYY-MM-DD');

    return {
        startDate, endDate
    };
}

const getStartEndDatesMonth = () =>  {
    var moment = require('moment');
    const startDate = moment().startOf("month").format('YYYY-MM-DD');
    const endDate = moment().endOf("month").format('YYYY-MM-DD');

    return {
        startDate, endDate
    };
}

/**  
 *  ユーザーの残有給数確認確認
 *  @param {int} id
 *  @param {string} email
 */
 function CheckUserRemainHolidayFunction(response, requestBody)  {  
    const startEndDates = getStartEndDatesYear();
    const request = new Request(`SELECT ID FROM Attendence WHERE UserEmail=${requestBody.id} AND WorkedCategory=N'有給休暇' AND WorkedDate BETWEEN '${startEndDates.startDate}' AND '${startEndDates.endDate}';`, function(err) {  
        // Requestが失敗した場合
        if (err) {  
            console.log("error in request");
            console.log(err);
            response.status(500).send('Something broke!');
        }
    });  
    let emailCnt = 0;
    request.on('doneInProc', function (rowCount, more, rows) {
        console.log("Check connected!");
        // 結果データーをemailListに入れる
        emailCnt = rowCount;
    });
    request.on('requestCompleted', function () {
        // 元のユーザーデーターに残有給数を更新
        const resultData = {
            ...requestBody,
            remainHoliday: requestBody.remainHoliday - emailCnt
        };
        SelectKindaiSumDataFunction(response,resultData)
     });
    connection.execSql(request);
 }  
 

/**  
 *  勤怠確認
 *  @param {string} user
 *  @param {string} workedDate
 */
 function GetAttendenceFunction(response, requestBody)  {  
    const request = new Request(`SELECT WorkedDate, WorkedCategory, StartTime, EndTime, OffTime, WorkedContent FROM attendence WHERE UserEmail='${requestBody.user}' AND WorkedDate='${requestBody.workedDate}';`, function(err) {  
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
        console.log("Check Kindai completed!");
        // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
        if(emailCnt === 0) {
            response.status(200).json({});
        }
        else {
            const resultData = {
                WorkedDate: emailList[0][0].value,
                WorkedCategory: emailList[0][1].value.trim(),
                StartTime: emailList[0][2].value,
                EndTime: emailList[0][3].value,
                OffTime: emailList[0][4].value,
                WorkedContent: emailList[0][5].value.trim(),
            }
            response.status(200).json(resultData);
        }
     });
    connection.execSql(request);
 } 

/**  
 *  １ヶ月間勤怠データー取得
 *  @param {string} user
 */
 function GetAllAttendenceFunction(response, requestBody)  {  
    const startEndDates = getStartEndDatesMonth();
    const request = new Request(`SELECT WorkedCategory, WorkedDate, StartTime, EndTime, OffTime, WorkedTime, WorkedContent 
                                FROM attendence WHERE UserEmail='${requestBody.user}' 
                                AND WorkedDate BETWEEN '${startEndDates.startDate}' AND '${startEndDates.endDate}';`, 
        function(err) {  
        // Requestが失敗した場合
        if (err) {  
            console.log("error in request");
            console.log(err);
            response.status(500).send('Something broke!');
        }
    });  
    let kindaiCnt = 0;
    let kindaiList = [];
    request.on('doneInProc', function (rowCount, more, rows) {
        console.log("Check connected!");
        // 結果データーをemailListに入れる
        kindaiCnt = rowCount;
        kindaiList = rows;
    });
    request.on('requestCompleted', function () {
        console.log("Check Kindai completed!");
        // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
        if(kindaiCnt === 0) {
            response.status(200).json([]);
        }
        else {
            const resultData = kindaiList.map((obj)=> {
                return {
                    workedCategory: obj[0].value.trim(),
                    workedDate: obj[1].value,
                    startTime: obj[2].value,
                    endTime: obj[3].value,
                    offTime: obj[4].value,
                    workedTime: obj[5].value,
                    workedContent: obj[6].value.trim(),
                }
            }) 
            response.status(200).json(resultData);
        }
     });
    connection.execSql(request);
 } 


/**  
 *  勤怠登録・編集の確認
 *  @param {integer} user
 *  @param {Date} workedDate
 *  @param {string} workedCategory
 *  @param {time} startTime
 *  @param {time} endTime
 *  @param {time} offTime
 *  @param {time} workedTime
 *  @param {string} workedContent
 */
 function CheckKindaiFunction(response, requestBody)  {  
    const request = new Request(`SELECT workedDate FROM attendence WHERE UserEmail='${requestBody.user}' AND WorkedDate='${requestBody.workedDate}';`, function(err) {  
        // Requestが失敗した場合
        if (err) {  
            console.log("error in request");
            console.log(err);
            response.status(500).send('Something broke!');
        }
    });  

    let kindaiCnt = 0;
    request.on('doneInProc', function (rowCount, more, rows) {
        console.log("Check connected!");
        // 結果データーをemailListに入れる
        kindaiCnt = rowCount;
    });
    request.on('requestCompleted', function () {
        // emailListの数（DBからもらったデーター）がない場合登録Requestに移動
        if(kindaiCnt === 0) {
            InsertKindaiFunction(response, requestBody);
        }
        else {
            UpdateKindaiFunction(response, requestBody);
        }
    });
    connection.execSql(request);
 }  


/**  
 *  勤怠登録
 *  @param {integer} user
 *  @param {Date} workedDate
 *  @param {string} workedCategory
 *  @param {time} startTime
 *  @param {time} endTime
 *  @param {time} offTime
 *  @param {time} workedTime
 *  @param {string} workedContent
 */
 function InsertKindaiFunction(response, requestBody) {  
    const request = new Request("INSERT INTO Attendence (UserEmail,WorkedDate,WorkedCategory,StartTime,EndTime,OffTime,WorkedTime,WorkedContent) VALUES (@UserEmail,@WorkedDate,@WorkedCategory,@StartTime,@EndTime,@OffTime,@WorkedTime,@WorkedContent);", function(err) {  
        if (err) {  
            console.log("error in request");
            console.log(err);
            response.status(500).send('Something broke!');
        }  
    }); 
    request.addParameter('UserEmail', TYPES.Int, requestBody.user);  
    request.addParameter('WorkedDate', TYPES.NVarChar , requestBody.workedDate);  
    request.addParameter('WorkedCategory', TYPES.NVarChar , requestBody.workedCategory);  
    request.addParameter('StartTime', TYPES.VarChar ,requestBody.startTime);  
    request.addParameter('EndTime', TYPES.VarChar ,requestBody.endTime);  
    request.addParameter('OffTime', TYPES.VarChar ,requestBody.offTime);  
    request.addParameter('WorkedTime', TYPES.VarChar ,requestBody.workedTime);  
    request.addParameter('WorkedContent', TYPES.NVarChar ,requestBody.workedContent);  

    request.on('requestCompleted', function () {
        console.log("Insert completed!");
        CheckLoginUserNonPasswordFunction(response, requestBody.user);
    });
    connection.execSql(request);  
}  

function UpdateKindaiFunction(response, requestBody) {  
        const request = new Request(`UPDATE Attendence SET WorkedCategory = @WorkedCategory,StartTime = @StartTime,EndTime = @EndTime,OffTime = @OffTime,WorkedTime = @WorkedTime,WorkedContent = @WorkedContent WHERE UserEmail='${requestBody.user}' AND WorkedDate='${requestBody.workedDate}';`, function(err) {  
        if (err) {  
            console.log("error in request update");
            console.log(err);
            response.status(500).send('Something broke!');
        }  
    }); 
    request.addParameter('UserEmail', TYPES.Int, requestBody.user);  
    request.addParameter('WorkedDate', TYPES.NVarChar , requestBody.workedDate);  
    request.addParameter('WorkedCategory', TYPES.NVarChar , requestBody.workedCategory);  
    request.addParameter('StartTime', TYPES.VarChar ,requestBody.startTime);  
    request.addParameter('EndTime', TYPES.VarChar ,requestBody.endTime);  
    request.addParameter('OffTime', TYPES.VarChar ,requestBody.offTime);  
    request.addParameter('WorkedTime', TYPES.VarChar ,requestBody.workedTime);  
    request.addParameter('WorkedContent', TYPES.NVarChar ,requestBody.workedContent);  

    request.on('requestCompleted', function () {
        console.log("Update completed!");
        CheckLoginUserNonPasswordFunction(response, requestBody.user);
    });
    connection.execSql(request);  
}  

/**  
 *  勤怠データ表示
 *  @param {string} id
 */
 function SelectKindaiSumDataFunction(response, requestBody)  {  
    const startEndDates = getStartEndDatesMonth();
    const request = new Request(`SELECT COUNT(*) AS WorkedDay ,(SELECT COUNT(*) FROM Attendence WHERE UserEmail=${requestBody.id} AND  WorkedCategory=N'休日' AND WorkedDate 
                                        BETWEEN '${startEndDates.startDate}' AND '${startEndDates.endDate}') AS OFFEDDAY,CAST(FORMAT((SUM((DATEPART("ss",WorkedTime) + DATEPART("mi",WorkedTime) * 60 + 
                                        DATEPART("hh",WorkedTime) * 3600)) / 3600),'00') as varchar(max)) + ':' + CAST(FORMAT((SUM((DATEPART("ss",WorkedTime) + DATEPART("mi",WorkedTime) * 60 + 
                                        DATEPART("hh",WorkedTime) * 3600)) % 3600 / 60),'00') as varchar(max)) as WorkedTime FROM Attendence WHERE UserEmail=${requestBody.id} AND 
                                        ( WorkedCategory=N'勤務' OR WorkedCategory=N'自宅勤務') AND WorkedDate BETWEEN '${startEndDates.startDate}' AND '${startEndDates.endDate}';`, function(err) {  
        // Requestが失敗した場合
        if (err) {  
            console.log("Sum kindai error in request");
            console.log(err);
            response.status(500).send('Something broke!');
        }
    });  
    let dataCnt = 0;
    let dataList = [];
    request.on('doneInProc', function (rowCount, more, rows) {
        console.log("Sum kindai data connected!");
        // 結果データーをdataListに入れる
        dataCnt = rowCount;
        dataList = rows;
    });
    request.on('requestCompleted', function () {
        console.log("Check Kindai data completed!");
        // dataListの数（DBからもらったデーター）がない場合登録Requestに移動
        if(dataCnt === 0) {
            response.status(200).json({});
        }
        else {
            const resultData = {
                id:requestBody.id,
                email:requestBody.email,
                firstName:requestBody.firstName,
                familyName:requestBody.familyName,
                remainHoliday:requestBody.remainHoliday,
                workedDay: dataList[0][0].value,
                offedDay: dataList[0][1].value,
                workedTime: dataList[0][2].value,
            }
            response.status(200).json(resultData);
        }
     });
    connection.execSql(request);
 } 

module.exports = router;

