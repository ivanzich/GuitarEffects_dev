/**
 * Created by frouyer on 18/01/16.
 */

var config = require('config.json');
var express = require('express');
var router = express.Router();
var effectService = require('services/effect.service');
var log = require('../logs/effectLog.controller.js');

// routes
router.post('/register', registerEffect);
router.get('/effects', getListEffects);
router.get('/:id', getEffect);
router.put('/:_id', updateEffect);
router.delete('/:_id', deleteEffect);

module.exports = router;

function registerEffect(req, res) {
    effectService.create(req.body)
        .then(function () {
            log.info(req.body.id +' has been created');
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getEffect(req, res) {
    effectService.getById(req.effect.sub)
        .then(function (effect) {
            if (effect) {
                res.send(effect);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getListEffects(req, res) {
    effectService.getListEffects()
        .then(function (effect) {
            if (effect) {
                res.send(effect);
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
        return res.status(401).send('You can only update your own effect');
    }

    effectService.update(userId, req.body)
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
        return res.status(401).send('You can only delete your own effect');
    }

    effectService.delete(userId)
        .then(function () {
            log.info(req.user.username +'\'s effect has been deleted');
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}