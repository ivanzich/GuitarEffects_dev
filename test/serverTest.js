/**
 * Created by frouyer on 01/02/16.
 */

var assert = require('assert');
var userService = require('../services/user.service');



describe('Account', function() {
    describe('#create()', function () {
        it('should create without error', function (done) {
            var user = "{'username' : 'mochaTest', 'firstname' : 'mochaTest', 'lastname' : 'mochaTest', 'avatar' : 'avatar1', 'password' : 'qweqwe'}";
            userService.create(user);
            done();
        });
    });
});