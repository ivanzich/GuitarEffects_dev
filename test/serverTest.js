/**
 * Created by frouyer on 01/02/16.
 */

var assert = require('assert');
var userService = require('../services/user.service');
var projectService = require('../services/project.service');


describe('Account', function () {
    describe('#create()', function () {
        it('should create without error', function (done) {
            var user = "{'username' : 'mochaTest', 'firstname' : 'mochaTest', 'lastname' : 'mochaTest', 'avatar' : 'avatar1', 'password' : 'qweqwe'}";
            userService.create(user);

            done();
        });
    });
});


describe('Project', function () {
    describe('#createProject()', function () {
        it('Creation d\'un projet', function (done) {
            var id = projectService.getProjectList('test');
            done();
        });
    });
    describe('#getList()', function () {
        it('Creation d\'un projet', function (done) {
            var list = projectService.getProjectList();
            done();
        });
    });
});

