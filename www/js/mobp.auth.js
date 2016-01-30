angular.module('mobp.auth', [])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
    // If server response status 401, 403 rise event
    // It will be catch in AppCtrl, controller.js
    return {
        responseError: function(res) {
            $rootScope.$broadcast({
                403: AUTH_EVENTS.notAuthenticated,
                401: AUTH_EVENTS.notAuthorized
            }[res.status], res);

            return $q.reject(res);

        }
    };
})

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

.service('AuthService', function($q, $http, AUTH_PATH) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var isAuthenticated = false;
    var authToken;

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    }

    function loadUserAuthToken() {
        //var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        var token = getCookie(LOCAL_TOKEN_KEY);
        if (token) {
            useAuthToken(token);
        }
    }

    function storeUserAuthToken(token) {
        //window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        setCookie(LOCAL_TOKEN_KEY, token, 30);
        useAuthToken(token);
    }

    function useAuthToken(token) {
        isAuthenticated = true;
        authToken = token;

        // Set the token as header for your requests!
        $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserAuthToken() {
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var register = function(user) {
        //user.empno = user.empno;
        return $q(function(resolve, reject) {
            $http.post(AUTH_PATH.url + '/signup', user).then(function(result) {
                if (result.data.success) {
                    resolve({
                        msg: result.data.msg,
                        user: result.data.user
                    });
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var login = function(user) {
        return $q(function(resolve, reject) {
            //user.empno = user.empno;
            console.log(user);
            $http.post(AUTH_PATH.url + '/login', user).then(function(result) {
                if (result.data.success) {
                    storeUserAuthToken(result.data.token);
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var logout = function() {
        destroyUserAuthToken();
    };

    loadUserAuthToken();

    return {
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: function() {
            return isAuthenticated;
        },
    };
});
