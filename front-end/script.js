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

                  const url = $ctrl.cleanUrl(decodeURIComponent($location.url()).substring(1));
                  $ctrl.onChange(url);
                  $ctrl.search = url;

                  $rootScope.$on("$locationChangeStart", function ($event, next, current) {
                      if (next.substring(next.indexOf("#!/") + 3).indexOf('/') > -1) return; // don't process unencoded urls

                      const url = $ctrl.cleanUrl(next.split("/").pop());
                      //$ctrl.search = decodeURIComponent(url);
                      $ctrl.search = decodeURIComponent(url);
                      //$ctrl.search = url;
                      $ctrl.onChange(url, true);
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
              onChange(value, isEncoded) {
                  $ctrl.currentUrl = value;
                  if ($ctrl.search) {
                      $ctrl.search = $ctrl.search.replace('http://', "");
                      value = value.replace('http://', "");
                      $ctrl.search = $ctrl.search.replace('https://', "");
                      value = value.replace('https://', "");
                      $ctrl.search = $ctrl.search.replace(/[|&;:$@"<>()+,]/g, "");
                      value = value.replace(/[|&;:$@"<>()+,]/g, "");
                  }


                  if (isEncoded) {
                      //value = decodeURIComponent(value);
                  } else {
                      value = encodeURIComponent(value);
                  }
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

