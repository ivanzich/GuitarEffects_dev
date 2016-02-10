var config = require('../config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.connectionString);
var projectsDB = db.get('projects');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var service = {};

service.create = create;
service.update = update;
service.delete = _delete;
service.getById = getById;
service.getProjectList = getProjectList;

module.exports = service;

function getProjectList() {
    var deferred = Q.defer();
    projectsDB.find({}, function (err, project) {
        if (err) deferred.reject(err);
        if (project) {
            deferred.resolve(project);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    projectsDB.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(projectParam) {
    var deferred = Q.defer();

    // validation
    projectsDB.findOne(
        {title: projectParam.title},
        function (err, project) {
            if (err) deferred.reject(err);

            if (project) {
                // username already exists
                deferred.reject('Project "' + projectParam.title + '" is already taken');
            } else {
                createProject();
            }
        });

    function createProject() {

        projectsDB.insert(
            projectParam,
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, projectParam) {
    var deferred = Q.defer();


    // validation
    projectsDB.findById(_id, function (err, project) {
        if (err) deferred.reject(err);
        projectsDB.findOne(
                {title: projectParam.title},
                updateProject());

    });

    function updateProject() {
        // fields to update
        var set = {
            title: projectParam.title,
            nodes: projectParam.nodes,
            connections: projectParam.connections
        };

        projectsDB.findAndModify(
            {_id: _id},
            {$set: set},
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    projectsDB.remove(
        {_id: _id},
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });


    return deferred.promise;
}

function comment(_id, comment){
    var deferred = Q.defer();

    projectsDB.findById(_id, function (err, comment) {
       if(err) deferred.reject(err);
        projectsDB.findOne(

        )
    });
}