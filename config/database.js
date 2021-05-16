//require mongoose module
var mongoose = require('mongoose');

//require chalk module to give colors to console text
const colors = require('colors');
//require database URL from properties file
const config = require('config');
const dbURL = config.get("dbConfig.url")

const connected = colors.bold.cyan;
const error = colors.bold.yellow;
const disconnected = colors.bold.red;
const termination = colors.bold.magenta;

//export this function and imported by server.js
module.exports = function () {

    mongoose.connect(dbURL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    });

    mongoose.connection.on('connected', function () {
        console.log(connected("Mongoose default connection is open to ", dbURL));
    });

    mongoose.connection.on('error', function (err) {
        console.log(error("Mongoose default connection has occured " + err + " error"));
    });

    mongoose.connection.on('disconnected', function () {
        console.log(disconnected("Mongoose default connection is disconnected"));
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log(termination("Mongoose default connection is disconnected due to application termination"));
            process.exit(0)
        });
    });
}