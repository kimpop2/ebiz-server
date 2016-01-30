/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
angular.module('mobp.controllers', [])

// APP
.controller('AppCtrl', function($scope, $http, $ionicConfig, $ionicPopup, AuthService, AUTH_EVENTS, $state, $ionicActionSheet, AUTH_PATH) {
    
    //403 Session Error
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('auth.walkthrough');
        var alertPopup = $ionicPopup.alert({
          title: '인증실패',
          template: '인증되지 않았습니다.'
        });
        
    });
   
    //401 Permission Error
    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    	$state.go('app.home');
    	var alertPopup = $ionicPopup.alert({
          title: '권한없음',
          template: '사용권한이 없습니다.'
        });
    });
	

    $http.get(AUTH_PATH.url + '/userinfo').then(function(result) {
        console.log('home:' + result.data);
        $scope.userinfo = result.data.msg;
    });
	
    $scope.logout = function() {
        
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            //Here you can add some more buttons
            // buttons: [
            // { text: '<b>Share</b> This' },
            // { text: 'Move' }
            // ],
            titleText: '<h4>정말로 로그아웃 하시겠습니까?</h4>',
            destructiveText: '&nbsp;&nbsp;&nbsp;로그아웃 확인',
            cancelText: '취소',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                //Called when one of the non-destructive buttons is clicked,
                //with the index of the button that was clicked and the button object.
                //Return true to close the action sheet, or false to keep it opened.
                return true;
            },
            destructiveButtonClicked: function(){
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                AuthService.logout();
                $state.go('auth.walkthrough');
            }
        });
    };

})

//LOGIN
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state, $stateParams, $templateCache, $q, $rootScope) {
	
	$scope.doLogIn = function(){
		AuthService.login($scope.user).then(function(msg) {
            $state.go('app.home');
		}, function(errMsg) {
		    var alertPopup = $ionicPopup.alert({
		        title: '로그인 실패',
		        template: errMsg
		    });
		});
	};

	$scope.user = {};
	
	if($stateParams.user !== null) {
		$scope.user.empno = $stateParams.user.empno;
	}
	// **************************************************
	// **************************************************
	// 테스트 아이디 비번 미리셋팅
	// **************************************************
	// **************************************************
	else{
		$scope.user.empno = '105000049';
		$scope.user.password = '1111';
	}
	//$scope.user.pin = "12345";

	// We need this for the form validation
	$scope.selected_tab = "";

	$scope.$on('my-tabs-changed', function (event, data) {
		$scope.selected_tab = data.title;
	});

})

.controller('SignupCtrl', function($scope, AuthService, $ionicPopup, $state) {
	$scope.user = {};

	$scope.doSignUp = function(){

		AuthService.register($scope.user).then(function(result) {
			$state.go('auth.login', {user: result.user});
		    var alertPopup = $ionicPopup.alert({
		        title: '사용자 등록완료',
		        template: result.msg
		    });
		}, function(errMsg) {
		    var alertPopup = $ionicPopup.alert({
		        title: '사용자 등록실패',
		        template: errMsg
		    });
		});
		
	};
})

.controller('ForgotPasswordCtrl', function($scope, $state) {
	$scope.recoverPassword = function(){
		$state.go('app.feeds-categories');
	};

	$scope.user = {};
})


// SETTINGS
.controller('SettingsCtrl', function($scope, $ionicActionSheet, $state) {
	$scope.airplaneMode = true;
	$scope.wifi = false;
	$scope.bluetooth = true;
	$scope.personalHotspot = true;

	$scope.checkOpt1 = true;
	$scope.checkOpt2 = true;
	$scope.checkOpt3 = false;

	$scope.radioChoice = 'B';

	// Triggered on a the logOut button click
	/*
	$scope.showLogOutMenu = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			// buttons: [
			// { text: '<b>Share</b> This' },
			// { text: 'Move' }
			// ],
			destructiveText: '로그아웃',
			titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				//Called when one of the non-destructive buttons is clicked,
				//with the index of the button that was clicked and the button object.
				//Return true to close the action sheet, or false to keep it opened.
				return true;
			},
			destructiveButtonClicked: function(){
				//Called when the destructive button is clicked.
				//Return true to close the action sheet, or false to keep it opened.
				$state.go('auth.walkthrough');
			}
		});

	};
	*/
})

;
