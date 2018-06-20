'use strict';

const searchUrl = {
    controller: function (ApiService, $location, $rootScope) {
        const $ctrl = this;

        Object.assign($ctrl, {

              pageSize: 10,
              currentPage: 1,
              currentUrl: null,

              $onInit() {
                  document.querySelectorAll('.karma-container')[0].style.display = 'block'; // for noscript

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
              getNumber(num) {
                  return new Array(num);
              },
              goToPage(num) {
                  $ctrl.currentPage = num + 1;
                  $ctrl.onChange($ctrl.currentUrl);
              },
              onChange(value) {
                  $ctrl.currentUrl = value;
                  $location.path('/' + value);
                  const skip = $ctrl.pageSize * ($ctrl.currentPage - 1);
                  ApiService.getOne(value, skip)
                    .then((data) => {
                          $ctrl.results = data;

                          $ctrl.pagesCount = Math.ceil($ctrl.results.total / $ctrl.pageSize);
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

