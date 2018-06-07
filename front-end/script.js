'use strict';

const searchUrl = {
    controller: function (ApiService) {
        const $ctrl = this;

        Object.assign($ctrl, {

              $onInit() {

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
                  //console.log(value);

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

