/**
 * Created by frouyer on 19/01/16.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    res.render('register');
});

module.exports = router;
