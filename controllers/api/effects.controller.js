/**
 * Created by frouyer on 18/01/16.
 */

var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var log = require('../log.controller');

// routes
router.post('/register', registerEffect);
router.get('/effects', getListEffects);
router.get('/:id', getEffect);
router.put('/:_id', updateEffect);
router.delete('/:_id', deleteEffect);

module.exports = router;

function registerEffect(req, res) {
    userService.create(req.body)
        .then(function () {
            log.info(req.body.username +' has created account');
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getEffect(req, res) {
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

function getListEffects(req, res) {
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

function updateEffect(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            log.info(req.user.username +'\'s account has been updated');
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteEffect(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            log.info(req.user.username +'\'s account has been deleted');
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}