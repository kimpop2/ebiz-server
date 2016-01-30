/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
// Ionic Starter App

angular.module('underscore', [])
    .factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', [
    'ionic',
    'angularMoment',
    'underscore',
    'ngResource',
    'ngCordova',
    'slugifier',

    'mobp.controllers',
    'mobp.directives',
    'mobp.services',
    'mobp.factories',
    'mobp.filters',
    'mobp.views',

    'mobp.auth',
    'mobp.home',
    'mobp.config',
    'mobp.salary',
    'mobp.duty',

    'app.controllers',
    'app.services',
    'app.factories',
    'ngMap',
    'ionic.contrib.ui.tinderCards',
    'youtube-embed'
])

.run(function($ionicPlatform, PushNotificationsService, AuthService, $ionicPopup, $state, $rootScope, $ionicConfig, $timeout) {

    $ionicPlatform.on("deviceready", function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        PushNotificationsService.register();
    });

    // This fixes transitions for transparent background views
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('auth.walkthrough') > -1) {
            // set transitions to android to avoid weird visual effect in the walkthrough transitions
            $timeout(function() {
                $ionicConfig.views.transition('android');
                $ionicConfig.views.swipeBackEnabled(false);
                console.log("setting transition to android and disabling swipe back");
            }, 0);
        } else {
            if (!AuthService.isAuthenticated()) {

                if (toState.name !== 'auth.login' && toState.name !== 'auth.signup' && toState.name !== 'auth.forgot-password') {
                    event.preventDefault();

                    $state.go('auth.walkthrough');
                    var alertPopup = $ionicPopup.alert({
                        title: 'Session Error',
                        template: 'Session Expired. Please login again.'
                    });

                }
            }
        }
    });

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('app.feeds-categories') > -1) {
            // Restore platform default transition. We are just hardcoding android transitions to auth views.
            $ionicConfig.views.transition('platform');
            // If it's ios, then enable swipe back again
            if (ionic.Platform.isIOS()) {
                $ionicConfig.views.swipeBackEnabled(true);
            }
            console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
        }
    });

    $ionicPlatform.on("resume", function() {
        PushNotificationsService.register();
    });

})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $stateProvider

    //INTRO
    .state('auth', {
        url: "/auth",
        templateUrl: "views/auth/auth.html",
        abstract: true,
        controller: 'AuthCtrl'
    })

    .state('auth.walkthrough', {
        url: '/walkthrough',
        templateUrl: "views/auth/walkthrough.html"
    })

    .state('auth.login', {
        url: '/login',
        params: {
            user: null
        },
        templateUrl: "views/auth/login.html",
        controller: 'LoginCtrl'
    })

    .state('auth.signup', {
        url: '/signup',
        templateUrl: "views/auth/signup.html",
        controller: 'SignupCtrl'
    })

    .state('auth.forgot-password', {
        url: "/forgot-password",
        templateUrl: "views/auth/forgot-password.html",
        controller: 'ForgotPasswordCtrl'
    })

    // cache: false , when login app reload
    .state('app', {
        url: "/app",
        abstract: true,
        cache: false,
        templateUrl: "views/app/side-menu.html",
        controller: 'AppCtrl'
    })

    .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "views/app/settings.html",
                controller: 'SettingsCtrl'
            }
        }
    })
    
    .state('app.profile', {
        url: "/profile",
        views: {
            'menuContent': {
                templateUrl: "views/app/profile.html"
            }
        }
    })

    //MISCELLANEOUS
    .state('app.miscellaneous', {
        url: "/miscellaneous",
        views: {
            'menuContent': {
                templateUrl: "views/app/miscellaneous/miscellaneous.html"
            }
        }
    })

    .state('app.maps', {
        url: "/miscellaneous/maps",
        views: {
            'menuContent': {
                templateUrl: "views/app/miscellaneous/maps.html",
                controller: 'MapsCtrl'
            }
        }
    })

    .state('app.image-picker', {
        url: "/miscellaneous/image-picker",
        views: {
            'menuContent': {
                templateUrl: "views/app/miscellaneous/image-picker.html",
                controller: 'ImagePickerCtrl'
            }
        }
    })

    //LAYOUTS
    .state('app.layouts', {
        url: "/layouts",
        views: {
            'menuContent': {
                templateUrl: "views/app/layouts/layouts.html"
            }
        }
    })

    .state('app.tinder-cards', {
        url: "/layouts/tinder-cards",
        views: {
            'menuContent': {
                templateUrl: "views/app/layouts/tinder-cards.html",
                controller: 'TinderCardsCtrl'
            }
        }
    })

    .state('app.slider', {
        url: "/layouts/slider",
        views: {
            'menuContent': {
                templateUrl: "views/app/layouts/slider.html"
            }
        }
    })

    //FEEDS
    .state('app.feeds-categories', {
        url: "/feeds-categories",
        views: {
            'menuContent': {
                templateUrl: "views/app/feeds/feeds-categories.html",
                controller: 'FeedsCategoriesCtrl'
            }
        }
    })

    .state('app.category-feeds', {
        url: "/category-feeds/:categoryId",
        views: {
            'menuContent': {
                templateUrl: "views/app/feeds/category-feeds.html",
                controller: 'CategoryFeedsCtrl'
            }
        }
    })

    .state('app.feed-entries', {
        url: "/feed-entries/:categoryId/:sourceId",
        views: {
            'menuContent': {
                templateUrl: "views/app/feeds/feed-entries.html",
                controller: 'FeedEntriesCtrl'
            }
        }
    })

    //WORDPRESS
    .state('app.wordpress', {
        url: "/wordpress",
        views: {
            'menuContent': {
                templateUrl: "views/app/wordpress/wordpress.html",
                controller: 'WordpressCtrl'
            }
        }
    })

    .state('app.post', {
        url: "/wordpress/:postId",
        views: {
            'menuContent': {
                templateUrl: "views/app/wordpress/wordpress_post.html",
                controller: 'WordpressPostCtrl'
            }
        },
        resolve: {
            post_data: function(PostService, $ionicLoading, $stateParams) {
                $ionicLoading.show({
                    template: 'Loading post ...'
                });

                var postId = $stateParams.postId;
                return PostService.getPost(postId);
            }
        }
    })

    //OTHERS

    .state('app.forms', {
        url: "/forms",
        views: {
            'menuContent': {
                templateUrl: "views/app/forms/forms.html"
            }
        }
    })

    .state('app.bookmarks', {
        url: "/bookmarks",
        views: {
            'menuContent': {
                templateUrl: "views/app/bookmarks/bookmarks.html",
                controller: 'BookMarksCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/auth/walkthrough');

});
