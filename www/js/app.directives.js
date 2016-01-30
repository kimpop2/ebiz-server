/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
angular.module('mobp.directives', [])

.directive('ionicYoutubeVideo', function($timeout, $ionicPlatform, youtubeEmbedUtils) {
	return {
		restrict: 'E',
		scope: {
			videoId: '@'
		},
		controller: function($scope, $element, $attrs) {
			$scope.playerVars = {
				rel: 0,
				showinfo: 0
			};
			$ionicPlatform.on("pause", function(){
				var yt_ready = youtubeEmbedUtils.ready;
				if(yt_ready)
				{
					$scope.yt_video.stopVideo();
				}
		  });
		},
		templateUrl: 'views/common/ionic-youtube-video.html',
		replace: false
	};
})

.directive('postContent', function($timeout, _, $compile) {
	return {
		restrict: 'A',
		scope: {},
		link: function(scope, element, attrs) {
			/**
			 * JavaScript function to match (and return) the video Id
			 * of any valid Youtube Url, given as input string.
			 * @author: Stephan Schmitz <eyecatchup@gmail.com>
			 * @url: http://stackoverflow.com/a/10315969/624466
			 */
			//  Ver: https://regex101.com/r/tY9jN6/1
			function ytVidId(url) {
			  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11,})(?:\S+)?$/gmi;
			  return (url.match(p)) ? RegExp.$1 : false;
			}

			$timeout(function(){
				var iframes = element.find('iframe');
				if(iframes.length > 0)
				{
					angular.forEach(iframes, function(i) {

						var iframe = angular.element(i),
								youtube_video_id = ((iframe.length > 0) && (!_.isUndefined(iframe[0].src))) ? ytVidId(iframe[0].src) : false;
						if(youtube_video_id !== false)
						{
							// Then it's a youtube video, compile our custom directive
							var ionic_yt_video = $compile("<ionic-youtube-video video-id='"+youtube_video_id+"'></ionic-youtube-video>")(scope);
        			iframe.parent().append(ionic_yt_video);
							iframe.remove();
						}
					});
				}
			}, 10);
		}
	};
})

//Use this directive to open external links using inAppBrowser cordova plugin
.directive('dynamicAnchorFix', function($ionicGesture, $timeout, $cordovaInAppBrowser) {
	return {
		scope: {},
		link: function(scope, element, attrs) {
			$timeout(function(){
				var anchors = element.find('a');
				if(anchors.length > 0)
				{
					angular.forEach(anchors, function(a) {

						var anchor = angular.element(a);

						anchor.bind('click', function (event) {
							event.preventDefault();
							event.stopPropagation();

							var href = event.currentTarget.href;
							var	options = {};

							//inAppBrowser see documentation here: http://ngcordova.com/docs/plugins/inAppBrowser/

							$cordovaInAppBrowser.open(href, '_blank', options)
								.then(function(e) {
									// success
								})
								.catch(function(e) {
									// error
								});
						});

					});
				}
			}, 10);
		},
		restrict: 'A',
		replace: false,
		transclude: false
	};
})

;
