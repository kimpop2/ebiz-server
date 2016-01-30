/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
angular.module('mobp.config', [])
.constant('WORDPRESS_API_URL', 'http://wordpress.startapplabs.com/blog/api/')

.constant('GCM_SENDER_ID', '574597432927')

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized   : 'auth-not-authorized'
})

.constant('USER_ROLES', {
  user: 'user'
})
 
.constant('SERVER_PATH', {
  //url: 'http://52.79.52.210/api/v1'
  url: 'http://localhost:5000/api/v1'
})

.constant('AUTH_PATH', {
  //url: 'http://52.79.52.210/api/auth'
  url: 'http://localhost:5000/api/auth'
})

.constant('PUSH_PATH', {
  url: 'http://localhost:8100'
})

.constant('CALL_NUMBER', {
	salary: '01038765656',
	duty: '01038765656'
});
