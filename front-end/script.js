'use strict';

const searchUrl = {
    controller: function (ApiService, $location, $rootScope) {
        const $ctrl = this;

        Object.assign($ctrl, {

              $onInit() {
                  document.querySelectorAll('.karma-container')[0].style.display = 'block';

                  const url = $ctrl.cleanUrl($location.url().substring(1));
                  $ctrl.onChange(url);
                  $ctrl.search = url;

                  $rootScope.$on("$locationChangeStart", function ($event, next, current) {
                      const url = $ctrl.cleanUrl(next.split("/").pop());
                      $ctrl.search = url;
                      $ctrl.onChange(url);
                  });
              },
              cleanUrl(url) {
                  return url.split('?')[0]; // cut ?skip=*
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

