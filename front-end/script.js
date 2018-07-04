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

                  $ctrl.search = $ctrl.cleanUrl($location.url().substring(1));

                  document.getElementById('search').focus();

                  $rootScope.$on("$locationChangeStart", function ($event, next, current) {

                      const url = $ctrl.cleanUrl(atob(next.split("/").pop()));
                      document.title = url + ' (makarma)';

                      $ctrl.search = $ctrl.link ? atob(url) : url; // from last links ?

                      if ($ctrl.link) {
                          $ctrl.onChange(atob(url));
                          $ctrl.link = false;
                      }

                      if (!$ctrl.init) { // if page just loaded, then load from url
                          $ctrl.onChange(url);
                          $ctrl.init = true;
                      }

                      // clean comments for main page
                      if (url === '') {
                          $ctrl.results.data = null;
                          $ctrl.pagesCount = null;
                          $ctrl.currentPage = 1;
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

angular.module('karmaApp', ['ngSanitize'])
  .component('searchUrl', searchUrl);


