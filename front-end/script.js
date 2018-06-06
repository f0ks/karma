const parentComponent = {
    controller: function (ApiService) {
        const ctrl = this;

        Object.assign(ctrl, {

              $onInit() {


                  ApiService.getAll()
                    .then(
                      function(data) {
                          console.log(data)
                      },
                      function(errResponse){
                          console.error('Error while fetching contacts');
                      }
                    );
              }

          }
        );

        ctrl.api = {
            someKey: 123
        };
        ctrl.someMethod = function (event) {
            ctrl.api = event.message;
        };
    },
    template: `
    	<div>
        <h1>Parent API: {{ $ctrl.api.someKey }}</h1>
        <child 
          api="$ctrl.api"
          on-update="$ctrl.someMethod($event);">
        </child>
      </div>
    `
};

const childComponent = {
    bindings: {
        api: '<',
        onUpdate: '&'
    },
    template: `
  	<div>
      Child component
      <input ng-model="$ctrl.api.someKey">
      <button ng-click="$ctrl.doSomething();">
        Click me
      </button>
    </div>
  `,
    controller: function () {
        const ctrl = this;
        ctrl.$onChanges = function (changes) {
            if (changes.api) {
                ctrl.api = angular.copy(ctrl.api);
            }
        };
        ctrl.doSomething = function () {
            ctrl.onUpdate({
                $event: {
                    message: ctrl.api
                }
            });
        };
    }
};

angular.module('demoApp', [])
  .component('parent', parentComponent)
  .component('child', childComponent);

angular.module('demoApp').factory('ApiService', ['$http', '$q', function ($http, $q) {

    let REST_SERVICE_URI = 'http://localhost:3000/comments';

    let factory = {
        getAll: getAll,
        createDepartment: createDepartment,
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

    function createDepartment(department) {
        let deferred = $q.defer();
        $http.post(REST_SERVICE_URI + 'department/create.php', department)
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
