'use strict';

angular.module('karmaApp').factory('ApiService', ['$http', '$q', function ($http, $q) {

    var REST_SERVICE_URI = '/rest/comments';

    return {
        getAll: getAll,
        getOne: getOne,
        create: create
    };

    function getAll() {
        var deferred = $q.defer();
        $http.get(REST_SERVICE_URI).then(function (response) {
            deferred.resolve(response.data);
        }, function (errResponse) {
            console.error('Error while fetching departments');
            deferred.reject(errResponse);
        });
        return deferred.promise;
    }

    function getOne(url, skip) {
        var deferred = $q.defer();
        if (url) $http.get(REST_SERVICE_URI + ('/' + url) + (skip ? '?skip=' + skip : '')).then(function (response) {
            deferred.resolve(response.data);
        }, function (errResponse) {
            console.error('Error while creating department');
            deferred.reject(errResponse);
        });
        return deferred.promise;
    }

    function create(data) {
        var deferred = $q.defer();
        $http.post(REST_SERVICE_URI, data).then(function (response) {
            deferred.resolve(response.data);
        }, function (errResponse) {
            console.error('Error while creating department');
            deferred.reject(errResponse);
        });
        return deferred.promise;
    }
}]);