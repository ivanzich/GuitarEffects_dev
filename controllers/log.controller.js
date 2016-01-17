/**
 * Created by frouyer on 17/01/16.
 */
var bunyan = require('bunyan');

//bunyan
var log = bunyan.createLogger({
    name: 'GuitarEffect',
    streams:[
        { stream: process.stdout },
        { path: './logs/access.log'}
    ]
});

module.exports = log;