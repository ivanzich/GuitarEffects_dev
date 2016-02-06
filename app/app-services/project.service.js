(function () {
    'use strict';

    angular
        .module('app')
        .factory('ProjectService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByProject = GetByProject;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetProjectList = GetProjectList;

        return service;


        function GetProjectList() {
            return $http.get('/api/projects/list').then(handleSuccess, handleError);
        }

        function GetCurrent() {
            return $http.get('/api/projects/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/projects').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/projects/' + _id).then(handleSuccess, handleError);
        }

        function GetByProject(project) {
            return $http.get('/api/projects/' + project).then(handleSuccess, handleError);
        }

        function Create(project) {
            return $http.post('/api/projects/register', project).then(handleSuccess, handleError);
        }

        function Update(project) {
            return $http.put('/api/projects/' + project._id, project).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/projects/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
