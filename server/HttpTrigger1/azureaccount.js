/* eslint-disable no-undef */
const config = {    
    server: process.env.DBHOSTNAME,  // Write host
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DBUSERNAME, // Write Username
            password: process.env.DBPASSWORD  // Write Password
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'test',  // Write database
        rowCollectionOnDone: true
    }
}; 

module.exports = config;