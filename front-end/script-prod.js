'use strict';

var searchUrl = {
    controller: function controller(ApiService, $location, $rootScope) {
        var $ctrl = this;

        Object.assign($ctrl, {

            pageSize: 10,
            currentPage: 1,
            currentUrl: null,
            init: false,

            $onInit: function $onInit() {
                document.querySelectorAll('.karma-container')[0].style.display = 'block'; // for noscript

                var url = $ctrl.cleanUrl($location.url().substring(1));
                //$ctrl.onChange(atob(url));
                $ctrl.search = url;

                document.getElementById('search').focus();

                $rootScope.$on("$locationChangeStart", function ($event, next, current) {

                    var url = $ctrl.cleanUrl(atob(next.split("/").pop()));
                    document.title = url + ' (makarma)';

                    $ctrl.search = $ctrl.link ? atob(url) : url; // from last links ?

                    if ($ctrl.link) {
                        $ctrl.onChange(atob(url));
                        $ctrl.link = false;
                    }

                    //$ctrl.search = url;
                    if (!$ctrl.init) {
                        // if page just loaded, then load from url
                        $ctrl.onChange(url);
                        $ctrl.init = true;
                    }
                });

                // get last posts
                ApiService.getAll().then(function (data) {
                    $ctrl.lastPosts = data;
                }, function (err) {
                    console.log(err);
                    alert('error');
                });
            },


            getLocation: function getLocation() {
                return $location.path();
            },
            getLink: function getLink(url) {
                return btoa(url);
            },

            cleanUrl: function cleanUrl(url) {
                return url.split('?')[0]; // cut ?skip=*
            },
            getNumber: function getNumber(num) {
                return new Array(num);
            },
            goToPage: function goToPage(num) {
                $ctrl.currentPage = num + 1;
                $ctrl.onChange($ctrl.currentUrl);
            },
            onChange: function onChange(value) {
                $ctrl.currentUrl = value;

                $location.path('/' + btoa(value));
                var skip = $ctrl.pageSize * ($ctrl.currentPage - 1);
                ApiService.getOne(btoa(value), skip).then(function (data) {
                    $ctrl.results = data;

                    $ctrl.pagesCount = Math.ceil($ctrl.results.total / $ctrl.pageSize);
                    console.log(data);
                }, function (err) {
                    console.log(err);
                    alert('error');
                });
            },
            create: function create(name, comment) {
                ApiService.create({ "url": btoa(name), "comment": comment }).then(function (data) {
                    $ctrl.onChange($ctrl.search);
                    $ctrl.comment = '';
                }, function (err) {
                    console.log(err);
                    alert('error');
                });
            }
        });
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

angular.module('karmaApp', ['ngSanitize']).component('searchUrl', searchUrl);

//.component('searchResults', searchResults);