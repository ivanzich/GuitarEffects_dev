/**
 * Created by frouyer on 18/01/16.
 */
var bunyan = require('bunyan');

//bunyan
var log = bunyan.createLogger({
    name: 'GuitarEffect',
    streams:[
        { stream: process.stdout },
        { path: './logs/effect.log'}
    ]
});

module.exports = log;