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

                        $ctrl.search = url;
                        //$ctrl.search = url;
                        if (!$ctrl.init) { // if page just loaded, then load from url
                            $ctrl.onChange(url);
                            $ctrl.init = true;
                        }

                    });
                },

                cleanUrl(url) {
                    return url.split('?')[0]; // cut ?skip=*
                },
                linkify(inputText) {
                    let replacedText, replacePattern1, replacePattern2, replacePattern3;

                    //URLs starting with http://, https://, or ftp://
                    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
                    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

                    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
                    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
                    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

                    //Change email addresses to mailto:: links.
                    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
                    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

                    return replacedText;
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

