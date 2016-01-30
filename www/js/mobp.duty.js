/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
angular.module('mobp.duty', ['ngResource', 'ionic-datepicker'])

.config(function($stateProvider, USER_ROLES) {
    // 급상여
    $stateProvider
    .state('app.dailyduty', {
        url: "/duty/dailyduty/",
        views: {
            'menuContent': {
                templateUrl: "views/duty/duty.html",
                controller: "DutyCtrl",
            }
        }
    });

})

.factory('Dailyduty', function($resource, SERVER_PATH) {

    return $resource(SERVER_PATH.url + '/duty/dailyduty/:day');
})


.factory('Vacation', function($resource, SERVER_PATH) {

    return $resource(SERVER_PATH.url + '/duty/vacation/:year');
})

.factory('Employee', function($resource, SERVER_PATH) {

    return $resource(SERVER_PATH.url + '/duty/employee');
})
.factory('VacationDetail', function($resource, SERVER_PATH) {

    return $resource(SERVER_PATH.url + '/duty/vacation-detail/:year');
})

.factory('Overtime', function($resource, SERVER_PATH) {

    return $resource(SERVER_PATH.url + '/duty/overtime/:month');
})

.controller('DutyCtrl', function ($scope, $stateParams, $ionicPopup, $ionicLoading, Dailyduty, Vacation, VacationDetail, Employee, Overtime, $ionicScrollDelegate) {
    Date.prototype.yyyy = function() {
       var yyyy = this.getFullYear().toString();
       return yyyy; 
    };
    
    Date.prototype.yyyymm = function(dash) {
       var yyyy = this.getFullYear().toString();
       var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
       return yyyy + dash + (mm[1] ? mm : '0'+mm[0]); // padding
    };
    
    Date.prototype.yyyymmdd = function(dash) {
       var yyyy = this.getFullYear().toString();
       var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
       var dd  = this.getDate().toString();
       return yyyy + dash + (mm[1] ? mm : '0'+mm[0]) + dash + (dd[1] ? dd : '0'+dd[0]); // padding
    };
    
    Date.prototype.addDays = function (n) {
        var time = this.getTime();
        var changedDate = new Date(time + (n * 24 * 60 * 60 * 1000));
        this.setTime(changedDate.getTime());
        return this;
    };

    var datePickerCallback = function(val) {
        if (typeof(val) === 'undefined') {
            console.log('No date selected');
        } else {
            var currDay = ('' + $scope.dutyday).split('-');
            var selectDay = val.yyyymmdd('-');
            changeDuty(currDay, selectDay);
            console.log('Selected date is : ', $scope.dutyday);
        }
    };

    $scope.datepickerObject = {
        titleLabel: '일자선택 후 확인하세요.',  //Optional

        todayLabel: '오늘',  //Optional
        closeLabel: '닫기',  //Optional
        setLabel: '확인',  //Optional  
        
        setButtonType : 'button-positive',  //Optional
        todayButtonType : 'button-calm',  //Optional
        closeButtonType : 'button-dark',  //Optional
        
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        
        templateType: 'popup', //Optional (modal, popup)
        showTodayButton: false, //Optional
        
        from: new Date(2013, 1, 1), //Optional
        to: new Date(), //Optional
        dateFormat: 'yyyy-MM-dd', //Optional
        closeOnSelect: true, //Optionall
        
        callback: function(val) { //Mandatory
            datePickerCallback(val);
        }
    };

    $scope.dailyduty = {};
    $scope.vacation = {master:null, details:null, employee:null};
    $scope.overtimes = {};

    var dailyduty_finished = false;
    var vacation_finished = false;
    var overtime_finished = false;

    function getDailyduty(){
        // 일근태현황
        Dailyduty.get({day: $scope.dutyday}).$promise
        .then(function(result) {
            $scope.dailyduty = result;
        }, function(error) {
            console.log(error);
        })
        .finally(function(){
            dailyduty_finished = true;
            endRefresh();
        console.log('dailyduty_finished:' + dailyduty_finished);
        });
    } 
    
    function getVacation(){
        // 연차현황-연차정보
        Vacation.get({year: $scope.year}).$promise
        .then(function(result) {
            $scope.vacation.master = result;
        }, function(error) {
            console.log(error);
        })
        .finally(function(){
            vacation_finished = true;
            endRefresh();
            console.log('vacation_finished:' + vacation_finished);
        });
        // 연차현황-연차상세   
        VacationDetail.query({year: $scope.year}).$promise
        .then(function(result) {
            $scope.vacation.details = result;
        }, function(error) {
            console.log(error);
        });
        // 연차현황-사원정보
        Employee.get({}).$promise
        .then(function(result) {
            $scope.vacation.employee = result;
        }, function(error) {
            console.log(error);
        });
    }
    
    function getOvertime(){
        // 잔업신청현황
        Overtime.query({month: $scope.month}).$promise
        .then(function(result) {
            $scope.overtimes = result;
        }, function(error) {
            console.log(error);
        })
        .finally(function(){
            overtime_finished = true;
        console.log('overtime_finished:' + overtime_finished);
            endRefresh();
        });    
    }
    
    function getDuty(){
        dailyduty_finished = false;
        vacation_finished = false;
        overtime_finished = false;    
        
        // Setup the loader
        $ionicLoading.show({template: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner>'});
        
        getDailyduty();
        getVacation();
        getOvertime();
    }

    function endRefresh(){
    console.log('endRefresh',dailyduty_finished, vacation_finished, overtime_finished);
        if(dailyduty_finished && vacation_finished && overtime_finished){
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
        } 
    }

    $scope.doRefresh = function() {
        $scope.year     = new Date().yyyy();
        $scope.month    = new Date().yyyymm('-');   // yyyy-mm
        $scope.dutyday  = new Date().yyyymmdd('-'); // yyyy-mm-dd
        
        getDuty();
    };  

    $scope.prevDailyduty = function(){
        var currDay = ('' + $scope.dutyday).split('-');
        console.log('currDay:' + currDay);
        var newDay = new Date(currDay[0], currDay[1] - 1, currDay[2]).addDays(-1).yyyymmdd('-');
        
        changeDuty(currDay, newDay);
    };

    $scope.nextDailyduty = function(){
        var currDay = ('' + $scope.dutyday).split('-');
        console.log('currDay:' + currDay);
        var newDay = new Date(currDay[0], currDay[1] - 1, currDay[2]).addDays(1).yyyymmdd('-');

        changeDuty(currDay, newDay);
    };

    function changeDuty(currDay, newDay){
        var compDay = newDay.split('-');
        // year change
        if(currDay[0] !== compDay[0]){
            $scope.year = newDay.substring(0,4); // yyyy
            getVacation();
        }
        // month change
        if(currDay[1] !== compDay[1]){
            $scope.month = newDay.substring(0,7); // yyyy-mm
            getOvertime();
        }
        
        $scope.dutyday = newDay;
        getDailyduty();
    };
    
    $scope.prevVacation = function(){
        var yyyy = $scope.year*1 - 1; // yyyymm
        
        changeVacation(yyyy);
    };

    $scope.nextVacation = function(){
        var yyyy = $scope.year*1 + 1; // yyyymm
    
        changeVacation(yyyy);
    };

    function changeVacation(yyyy){
        $scope.year = '' + yyyy;
        getVacation();
        
        $scope.month = $scope.year + '-01';
        getOvertime();
        
        $scope.dutyday = $scope.month + '-01';
        getDailyduty();
    }

    $scope.scrollVcToTop = function() {
        $ionicScrollDelegate.$getByHandle('vc-handle').scrollTop();
    };


    $scope.prevOvertime = function(){
        var month = $scope.month; // yyyy-mm
        // String*1 due to type cating to Number
        var yyyy = month.substring(0,4)*1;
        var mm   = month.substring(5,7)*1;

        if( mm == 1){
            mm = 12;
            yyyy = yyyy - 1;

            $scope.year = yyyy;
            getVacation();
        }
        else{
            mm = mm - 1;
        }

        changeOvertime(yyyy, mm);
    };
    
    $scope.nextOvertime = function(){
        var month = $scope.month; // yyyy-mm
        // String*1 due to type cating to Number
        var yyyy = month.substring(0,4)*1;
        var mm   = month.substring(5,7)*1;

        if( mm == 12){
            mm = 1;
            yyyy = yyyy + 1;

            $scope.year = yyyy;
            getVacation();
        }
        else{
            mm = mm + 1;
        }

        changeOvertime(yyyy, mm);
    };

    function changeOvertime(yyyy, mm){
        // '' + Number due to cype casting to String
        $scope.month = '' + yyyy + '-' + ((mm < 10) ? '0' + mm : mm); // yyyy-mm
        getOvertime();

        $scope.dutyday = $scope.month + '-01'; // yyyy-mm-dd
        getDailyduty();
    }

    $scope.scrollOtToTop = function() {
        $ionicScrollDelegate.$getByHandle('ot-handle').scrollTop();
    };
    
    $scope.doRefresh();

});
