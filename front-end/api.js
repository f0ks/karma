'use strict';

angular.module('karmaApp').factory('ApiService', ['$http', '$q', function ($http, $q) {

    const REST_SERVICE_URI = '/rest/comments';

    return {
        getAll: getAll,
        getOneById: getOneById,
        getPage: getPage,
        create: create
    };

    function getAll() {
        let deferred = $q.defer();
        $http.get(REST_SERVICE_URI)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    alert('error');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function getPage(url, skip) {
        let deferred = $q.defer();
        if (url) $http.get((REST_SERVICE_URI + `/${url}`) + (skip ? `?skip=${skip}` : ``))
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    alert('error');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function getOneById(id) {
        let deferred = $q.defer();
        $http.get((REST_SERVICE_URI + `/id/${id}`))
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    alert('error');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function create(data) {
        let deferred = $q.defer();
        $http.post(REST_SERVICE_URI, data)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    alert('error');
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

}]);
