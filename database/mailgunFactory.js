/*jshint esversion: 6 */ 
const mailgun = require('mailgun-js');
const fs = require('fs');

function getCredentials(){
    let rawData =  fs.readFileSync('./database/mailgunCredentials.json');
    let credentials = JSON.parse(rawData);
    return credentials;
}

function getTransporter(){
    const credentials = getCredentials();
    const mg = mailgun(credentials);
    return mg;
}

// exports
module.exports = {getTransporter};
