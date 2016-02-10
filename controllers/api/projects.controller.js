/**
 * Created by frouyer on 18/01/16.
 */

var config = require('config.json');
var express = require('express');
var router = express.Router();
var projectService = require('services/project.service');
var userService = require('services/user.service');
var log = require('../logs/effectLog.controller.js');

// routes
router.post('/register', registerProject);
router.get('/list', getListProjects);
router.get('/:id', getProject);
router.put('/:_id', updateEffect);
router.delete('/:_id', deleteEffect);

module.exports = router;

function registerProject(req, res) {
    projectService.create(req.body)
        .then(function () {
            log.info(req.body.title +' has been created');
            console.log(req.body._id);
            res.send(req.body._id);
            //res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getProject(req, res) {
    projectService.getById(req.params.id)
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

function getListProjects(req, res) {

    projectService.getProjectList()
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

    //console.log(req.params);

    //console.log(req.user.sub);
    //console.log(req.body.authorId);
    if (req.user.sub !== req.body.authorId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }


    projectService.update(req.params._id, req.body)
        .then(function () {
            log.info(req.body.title + '\'s project has been updated');
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

}

function deleteEffect(req, res) {

    /*
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own effect');
    }*/
    console.log(req.user.sub);
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                console.log(user.role.localeCompare('admin')===0);

                projectService.getById(req.params._id)
                    .then(function(project) {
                        if (project) {
                            if((user.role.localeCompare('admin')===0) || (req.user.sub === project.authorId)) {
                                projectService.delete(req.params._id)
                                    .then(function () {
                                        log.info(req.params._id + '\'s effect has been deleted');
                                        res.sendStatus(200);
                                    })
                                    .catch(function (err) {
                                        res.status(400).send(err);
                                    });
                            }else{
                                res.status(400).send('You don\'t have the right');
                            }
                        }
                })
            }}).catch(function (err) {
        res.status(400).send(err);
    });

}