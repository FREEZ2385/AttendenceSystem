/* eslint-disable no-undef */
const config = {    
    server: process.env.HOSTNAME,  // Write host
    authentication: {
        type: 'default',
        options: {
            userName: process.env.USERNAME, // Write Username
            password: process.env.PASSWORD  // Write Password
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