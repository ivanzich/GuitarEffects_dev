/**
 * Created by frouyer on 01/02/16.
 */

var assert = require('assert');
var userService = require('../services/user.service');
var projectService = require('../services/project.service');


describe('Account', function () {
    describe('#Test Service User', function () {
        it('Creation d\'un utilisateur', function (done) {
            var user = "{'username' : 'mochaTest', 'firstname' : 'mochaTest', 'lastname' : 'mochaTest', 'avatar' : 'avatar1', 'password' : 'qweqwe'}";
            userService.create(user);

            done();
        });
        it('Update d\'un utilisateur', function (done) {
            var user = "{'username' : 'mochaTest', 'firstname' : 'mochaTest', 'lastname' : 'mochaTest', 'avatar' : 'avatar1', 'password' : 'qweqwe'}";
            var id = userService.create(user);

            userService.update(id,'test');
            done();
        });
        it('Delete d\'un utilisateur', function (done) {
            var user = "{'username' : 'mochaTest', 'firstname' : 'mochaTest', 'lastname' : 'mochaTest', 'avatar' : 'avatar1', 'password' : 'qweqwe'}";
            var id = userService.create(user);

            userService.delete(id);
            done();
        });
    });
});


describe('Projects', function () {
    describe('#Test Service Projet', function () {
        it('Creation d\'un projet', function (done) {
            var id = projectService.create('test');

            projectService.update(id, 'blabla');
            done();
        });

        it('Liste des projets', function (done) {
            var list = projectService.getProjectList();
            done();
        });

        it('Update d\'un projet', function (done) {
            var id = projectService.create('test');
            projectService.update(id, 'blabla');
            done();
        });
        it('Delete d\'un projet', function (done) {
            var id = projectService.create('test');
            projectService.delete(id);
            done();
        });
    });
});

