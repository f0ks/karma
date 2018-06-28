'use strict';

const searchUrl = {
    controller: function (ApiService, $location, $rootScope) {
        const $ctrl = this;

        Object.assign($ctrl, {

              pageSize: 10,
              currentPage: 1,
              currentUrl: null,
              init: false,

              $onInit() {
                  document.querySelectorAll('.karma-container')[0].style.display = 'block'; // for noscript

                  const url = $ctrl.cleanUrl($location.url().substring(1));
                  //$ctrl.onChange(atob(url));
                  $ctrl.search = url;

                  document.getElementById('search').focus();

                  $rootScope.$on("$locationChangeStart", function ($event, next, current) {

                      const url = $ctrl.cleanUrl(atob(next.split("/").pop()));
                      document.title = url + ' (makarma)';

                      $ctrl.search = $ctrl.link ? atob(url) : url; // from last links ?

                      if ($ctrl.link) {
                          $ctrl.onChange(atob(url));
                          $ctrl.link = false;


                      }


                      //$ctrl.search = url;
                      if (!$ctrl.init) { // if page just loaded, then load from url
                          $ctrl.onChange(url);
                          $ctrl.init = true;
                      }

                  });

                  // get last posts
                  ApiService.getAll()
                    .then((data) => {
                          $ctrl.lastPosts = data;
                      }
                      ,
                      (err) => {
                          console.log(err);
                          alert('error');
                      }
                    );
              },

              getLocation: () => $location.path(),
              getLink: (url) => btoa(url),

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

                  $location.path('/' + btoa(value));
                  const skip = $ctrl.pageSize * ($ctrl.currentPage - 1);
                  ApiService.getOne(btoa(value), skip)
                    .then((data) => {
                          $ctrl.results = data;

                          $ctrl.pagesCount = Math.ceil($ctrl.results.total / $ctrl.pageSize);
                          console.log(data)
                      }
                      ,
                      (err) => {
                          console.log(err);
                          alert('error');
                      }
                    );
              },
              create(name, comment) {
                  ApiService.create({"url": btoa(name), "comment": comment})
                    .then((data) => {
                          $ctrl.onChange($ctrl.search);
                          $ctrl.comment = '';
                      }
                      ,
                      (err) => {
                          console.log(err);
                          alert('error');
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

angular.module('karmaApp', ['ngSanitize'])
  .component('searchUrl', searchUrl);


//.component('searchResults', searchResults);

