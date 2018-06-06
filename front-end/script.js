'use strict';

const searchUrl = {
    controller: function (ApiService) {
        const $ctrl = this;

        Object.assign($ctrl, {

              $onInit() {


                  ApiService.getAll()
                    .then((data) => {
                          console.log(data)
                      }
                      ,
                      (err) => {
                          console.log(err)
                      }
                    );
              },
              onChange(value) {
                  console.log(value);
              }

          }
        );

    },
    templateUrl: 'search.html'
};

const searchResults = {
    bindings: {
        api: '<',
        onUpdate: '&'
    },
    templateUrl: 'search-result.html',
    controller: function () {

        const $ctrl = this;
        $ctrl.$onChanges = function (changes) {
            if (changes.api) {
                $ctrl.api = angular.copy($ctrl.api);
            }
        };
        $ctrl.doSomething = function () {
            $ctrl.onUpdate({
                $event: {
                    message: $ctrl.api
                }
            });
        };

    }
};

angular.module('karmaApp', [])
  .component('searchUrl', searchUrl)
  .component('searchResults', searchResults);

