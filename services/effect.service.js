/**
 * Created by frouyer on 18/01/16.
 */

var config = require('config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.connectionString);
var effectsDb = db.get('effects');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var service = {};

service.getById = getById;
service.create = create;
//service.update = update;
//service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    effectsDb.findById(_id, function (err, effetc) {
        if (err) deferred.reject(err);

        if (effetc) {
            // return effect
            deferred.resolve(effetc);
        } else {
            // effect not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getList() {
    var deferred = Q.defer();

    effectsDb.findById(null, function (err, effetc) {
        if (err) deferred.reject(err);

        if (effetc) {
            // return effect
            deferred.resolve(effetc);
        } else {
            // effect not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(effectParam) {
    var deferred = Q.defer();

    // validation
    effectsDb.findOne(
        { id: effectParam.id },

        function (err, effect) {
            if (err) deferred.reject(err);

            if (effect) {
                // effect already exists
                deferred.reject('Id  "' + effectParam.id + '" is already taken');
            } else {
                createEffect();
            }
        });

    function createEffect() {

        effectsDb.insert(
            effectParam,
            function (err, doc) {
                if (err) deferred.reject(err);
                deferred.resolve();
            });
    }
    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    usersDb.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            usersDb.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        usersDb.findAndModify(
            { _id: _id },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    usersDb.remove(
        { _id: _id },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}