/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
angular.module('mobp.salary', ['ngResource'])

.config(function($stateProvider, USER_ROLES) {
    
    $stateProvider
    .state('app.salary-months', {
        url: "/salary/salary-months/:year",
        views: {
            'menuContent': {
                templateUrl: "views/salary/salary-months.html",
                controller: "SalaryMonthsCtrl"
            }
        }
        
    })
    .state('app.salary', {
        url: "/salary/salary/:month",
        views: {
            'menuContent': {
                templateUrl: "views/salary/salary.html",
                controller: "SalaryCtrl"
            }
        }
    });
    
})

.factory('SalaryMonths', function ($resource, SERVER_PATH) {
    return $resource(SERVER_PATH.url + '/salary/salary-months/:year');
})

.factory('Salary', function ($resource, SERVER_PATH) {
    return $resource(SERVER_PATH.url + '/salary/salary/:month');
})
.factory('Bonus', function ($resource, SERVER_PATH) {
    return $resource(SERVER_PATH.url + '/salary/bonus/:month');
})
.factory('Monthlyduty', function ($resource, SERVER_PATH) {
    return $resource(SERVER_PATH.url + '/salary/monthlyduty/:month');
})

.controller('SalaryMonthsCtrl', function ($scope, $stateParams, $ionicLoading, SalaryMonths) {
    
    Date.prototype.yyyy = function() {
       var yyyy = this.getFullYear().toString();
       return yyyy; // padding
    };

    $scope.salarymonths = [];
    
    $scope.doRefresh = function() {
        var yyyy = new Date().yyyy();
        $scope.year = yyyy;
        getSalaryMonths();
    };
    
    function getSalaryMonths(){
        
        $ionicLoading.show({template: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner>'});
    
        SalaryMonths.query({year: $scope.year}).$promise
        .then(function(result) {
            $scope.salarymonths = result;
        }, function(error) {
            console.log(error);
        })
        .finally(function(){
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
        });
    }

    $scope.prevList = function(){
        var yyyy = $scope.year*1 - 1; // yyyymm
        $scope.year = '' + yyyy;
        getSalaryMonths();
    }
    
    $scope.nextList = function(){
        var yyyy = $scope.year*1 + 1; // yyyymm
        $scope.year = '' + yyyy;
        getSalaryMonths();
    }

    $scope.doRefresh();
})

.controller('SalaryCtrl', function ($scope, $stateParams, $ionicLoading, Salary, Bonus, Monthlyduty, CALL_NUMBER) {
    
    $scope.call_salary  = CALL_NUMBER.salary;
    $scope.salary       = {};
    $scope.bonuses      = [];
    $scope.monthlyduty  = {};
    
    var salary_finished = false;
    var bonus_finished  = false;
    var duty_finished   = false;
    
    function getSalary(){
        salary_finished = false;
        bonus_finished  = false;
        duty_finished   = false;

        //$ionicLoading.show({template: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner>'});
        // 급여
        Salary.get({month: $scope.month}).$promise
        .then(function(result) {
        
            $scope.salary = result;
        }, function(error) {
        
            console.log(error);
        })
        .finally(function(){
            salary_finished = true;
            endRefresh();
        });
        // 상여
        Bonus.query({month: $scope.month}).$promise
        .then(function(result) {
            $scope.bonuses = result;
            
            // calc total bonus
            var total = 0;
            for(var i=0; i<result.length; i++){
                total += result[i].bonus_amount;
            }
            $scope.bonustotal = total;
        }, function(error) {
            console.log(error);
        })
        .finally(function(){
            bonus_finished = true;
            endRefresh();
        });
        // 월근태
        Monthlyduty.get({month: $scope.month}).$promise
        .then(function(result) {
            $scope.monthlyduty = result;
        }, function(error) {
            console.log(error);
        })
        .finally(function(){
            duty_finished = true;
            endRefresh();
        });
    }

    function endRefresh(){
        if(salary_finished && bonus_finished && duty_finished){
            $scope.$broadcast('scroll.refreshComplete');
            //$ionicLoading.hide();
        } 
    }

    $scope.doRefresh = function() {
        
        $scope.month = $stateParams.month;  // yyyymm
        getSalary();
    };
    
        
    $scope.prevSalary = function(){
        var month = $scope.month; // yyyymm
        // String*1 due to type cating to Number
        var yyyy = month.substring(0,4)*1;
        var mm   = month.substring(4,6)*1;

        if( mm == 1){
            mm = 12;
            yyyy = yyyy - 1;
        }
        else{
            mm = mm - 1;
        }

        // '' + Number due to cype casting to String
        $scope.month = '' + yyyy + ((mm < 10) ? '0' + mm : mm);
        getSalary();
    }

    $scope.nextSalary = function(){
        var month = $scope.month; // yyyymm
        // String*1 due to type cating to Number
        var yyyy = month.substring(0,4)*1;
        var mm   = month.substring(4,6)*1;

        if( mm == 12){
            mm = 1;
            yyyy = yyyy + 1;
        }
        else{
            mm = mm + 1;
        }

        // '' + Number due to cype casting to String
        $scope.month = '' + yyyy + ((mm < 10) ? '0' + mm : mm);
        getSalary();
    }

    $scope.doRefresh();

});