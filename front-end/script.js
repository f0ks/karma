'use strict';

const searchUrl = {
    controller: function (ApiService, $location, $rootScope, $q) {

        const $ctrl = this;

        Object.assign($ctrl, {

                pageSize: 10,
                currentPage: 1,
                currentUrl: null,
                init: false,
                isReply: false,
                replyTo: null,
                images: [],
                fetchedReplies: {}, // {<id>: <reply_to_id>} loaded on mouseover id on reply post

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
                            if ($ctrl.results) {
                                $ctrl.results.data = null;
                            }
                            $ctrl.images = [];
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
                                //alert('error');
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

                goToMain() {
                    $location.path('/');
                },

                onChange(value) {
                    $ctrl.currentUrl = value;

                    $location.path('/' + btoa(value));
                    const skip = $ctrl.pageSize * ($ctrl.currentPage - 1);
                    ApiService.getPage(btoa(value), skip)
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
                addImg() {
                    let img = prompt('Image URL', '');
                    if (/^((https?|ftp):)?\/\/.*(jpeg|jpg|png|gif|bmp)$/.test(img)) {

                        let dup = false;
                        $ctrl.images.forEach((item) => {
                            if (item === img) {
                                dup = true;
                            }
                        });

                        if (!dup) {
                            $ctrl.images.push(img);
                        } else {
                            alert('Already added');
                        }

                    } else {
                        alert('Wrong image URL');
                    }

                },

                getCommentByIdFromDB(id) {

                    let deferred = $q.defer();

                    if ($ctrl.fetchedReplies.hasOwnProperty(id)) return; // already added


                    ApiService.getOneById(id)
                        .then((data) => {
                                $ctrl.fetchedReplies[id] = data.comment;
                                deferred.resolve();
                            }
                            ,
                            (err) => {
                                console.log(err);
                                deferred.reject();
                                alert('error');
                            }
                        );
                    return deferred.promise;

                },

                // if reply for comment on current page
                // no need to fetch it from server again
                getCommentByIdFromPage(id) {
                    let result = null;
                    $ctrl.results.data.forEach((el, i) => {
                        if (el._id === id) {
                            result = el.comment;
                        }
                    });
                    return result;
                },

                attachReplyTextToItem(item, commentId) {
                    if (!item.repliesText) {
                        item.repliesText = {};
                    }

                    if (item.repliesText[commentId]) return;

                    let promise = $ctrl.getCommentByIdFromDB(commentId);

                    promise.then(function() {
                        item.repliesText[commentId] = $ctrl.fetchedReplies[commentId];
                    }, function() {
                        console.log('error');
                    });


                },

                create(name, comment, replyTo) {

                    let model = {
                        "url": btoa(name),
                        "comment": comment,
                        "images": $ctrl.images
                    };

                    if (replyTo) {
                        model.replyTo = replyTo;
                    }

                    ApiService.create(model)
                        .then((data) => {
                                $ctrl.onChange($ctrl.search);
                                $ctrl.comment = '';
                                $ctrl.images = [];
                                $ctrl.cancelReply();
                            }
                            ,
                            (err) => {
                                console.log(err);
                                alert('Slow down. You post too fast.');
                            }
                        );
                },

                cancelReply() {
                    $ctrl.isReply = false;
                    $ctrl.replyTo = null;
                },

                reply(id) {
                    $ctrl.isReply = true;
                    $ctrl.replyTo = id;
                    const textarea = $('#karma-comment');
                    $('html, body').animate({
                        scrollTop: textarea.offset().top
                    }, 500);
                    textarea.focus();
                }

            }
        );

    },
    templateUrl: 'search.html'
};

angular.module('karmaApp', ['ngSanitize'])
    .component('searchUrl', searchUrl);


