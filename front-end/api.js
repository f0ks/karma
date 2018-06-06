angular.module('karmaApp').factory('ApiService', ['$http', '$q', function ($http, $q) {

    let REST_SERVICE_URI = 'http://localhost:3000/comments';

    let factory = {
        getAll: getAll,
        getOne: getOne,
        updateDepartment: updateDepartment,
        deleteDepartment: deleteDepartment
    };

    return factory;

    function getAll() {
        let deferred = $q.defer();
        $http.get(REST_SERVICE_URI)
          .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while fetching departments');
                deferred.reject(errResponse);
            }
          );
        return deferred.promise;
    }

    function getOne(url) {
        let deferred = $q.defer();
        $http.get(REST_SERVICE_URI + `/${url}`)
          .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while creating department');
                deferred.reject(errResponse);
            }
          );
        return deferred.promise;
    }


    function updateDepartment(department) {
        let deferred = $q.defer();
        $http.put(REST_SERVICE_URI + 'department/update.php', department)
          .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while updating department');
                deferred.reject(errResponse);
            }
          );
        return deferred.promise;
    }

    function deleteDepartment(id) {
        let deferred = $q.defer();
        $http.delete(REST_SERVICE_URI + 'department/delete.php?id=' + id)
          .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function (errResponse) {
                console.error('Error while deleting department');
                deferred.reject(errResponse);
            }
          );
        return deferred.promise;
    }

}]);
