'use strict';

const searchUrl = {
    controller: function (ApiService, $location) {
        const $ctrl = this;

        Object.assign($ctrl, {

              $onInit() {
                  const url = $location.url().substring(1);
                  $ctrl.onChange(url);

                  // ApiService.getAll()
                  //   .then((data) => {
                  //         console.log(data)
                  //     }
                  //     ,
                  //     (err) => {
                  //         console.log(err)
                  //     }
                  //   );
              },
              onChange(value) {
                  $location.path('/' + value);
                  ApiService.getOne(value)
                    .then((data) => {
                          $ctrl.results = data;
                          console.log(data)
                      }
                      ,
                      (err) => {
                          console.log(err)
                      }
                    );
              },
              create(name, comment) {
                  ApiService.create({"url": name, "comment": comment})
                    .then((data) => {
                        $ctrl.onChange($ctrl.search);
                      }
                      ,
                      (err) => {
                          console.log(err)
                      }
                    );
              }

          }
        );

    },
    templateUrl: 'search.html'
};

/*
const searchResults = {
    bindings: {
        data: '='
    },
    templateUrl: 'search-result.html',
    controller: function () {


    }
};
*/

angular.module('karmaApp', [])
  .component('searchUrl', searchUrl)
//.component('searchResults', searchResults);

