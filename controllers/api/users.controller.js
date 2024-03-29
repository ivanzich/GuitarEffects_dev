﻿var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var log = require('../logs/accessLog.controller.js');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.get('/userlist', getUserList);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

module.exports = router;


function getUserList(req, res) {
    userService.getUserList()
        .then(function (userList) {
            res.send(userList);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                log.info(req.body.username + ' connected');
                res.send({token: token});
            } else {
                // authentication failed
                res.sendStatus(401);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            log.info(req.body.username + ' has created account ' + req.body.avatar);
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            log.info(req.user.username + '\'s account has been updated');
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;

    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {


                console.log('role : '+user.role);
                console.log('userid : '+userId);
                console.log('req.params : '+req.params._id);

                if ((user.role.localeCompare('admin'))) {
                    // can only delete own account
                    console.log(user.role.localeCompare('admin'));
                    return res.status(401).send('You can only delete your own account');
                }
                log.info(req.params.username + '\'s account has been deleted');
                console.log(req.params._id);
                userService.delete(req.params._id)
                    .then(function () {
                        res.sendStatus(200);
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    });
            }

        })
        .catch(function (err) {
            res.status(400).send(err);
        });

}