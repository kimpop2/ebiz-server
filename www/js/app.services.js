/*
 * Copyright (c) 2014, COPYRIGHTⓒ2014 eBiz-Pro. ALL RIGHTS RESERVED.
 *
 */
angular.module('app.services', ['mobp.config'])

.service('FeedList', function ($rootScope, FeedLoader, $q){
	this.get = function(feedSourceUrl) {
		var response = $q.defer();
		//num is the number of results to pull form the source
		FeedLoader.fetch({q: feedSourceUrl, num: 20}, {}, function (data){
			response.resolve(data.responseData);
		});
		return response.promise;
	};
})


// BOOKMARKS FUNCTIONS
.service('BookMarkService', function (_, $rootScope){

	this.bookmarkFeedPost = function(bookmark_post){

		var user_bookmarks = !_.isUndefined(window.localStorage.ionFullApp_feed_bookmarks) ?
														JSON.parse(window.localStorage.ionFullApp_feed_bookmarks) : [];

		//check if this post is already saved

		var existing_post = _.find(user_bookmarks, function(post){ return post.link == bookmark_post.link; });

		if(!existing_post){
			user_bookmarks.push({
				link: bookmark_post.link,
				title : bookmark_post.title,
				date: bookmark_post.publishedDate,
				excerpt: bookmark_post.contentSnippet
			});
		}

		window.localStorage.ionFullApp_feed_bookmarks = JSON.stringify(user_bookmarks);
		$rootScope.$broadcast("new-bookmark");
	};

	this.bookmarkWordpressPost = function(bookmark_post){

		var user_bookmarks = !_.isUndefined(window.localStorage.ionFullApp_wordpress_bookmarks) ?
														JSON.parse(window.localStorage.ionFullApp_wordpress_bookmarks) : [];

		//check if this post is already saved

		var existing_post = _.find(user_bookmarks, function(post){ return post.id == bookmark_post.id; });

		if(!existing_post){
			user_bookmarks.push({
				id: bookmark_post.id,
				title : bookmark_post.title,
				date: bookmark_post.date,
				excerpt: bookmark_post.excerpt
			});
		}

		window.localStorage.ionFullApp_wordpress_bookmarks = JSON.stringify(user_bookmarks);
		$rootScope.$broadcast("new-bookmark");
	};

	this.getBookmarks = function(){
		return {
			feeds : JSON.parse(window.localStorage.ionFullApp_feed_bookmarks || '[]'),
			wordpress: JSON.parse(window.localStorage.ionFullApp_wordpress_bookmarks || '[]')
		};
	};
})


// WP POSTS RELATED FUNCTIONS
.service('PostService', function ($rootScope, $http, $q, WORDPRESS_API_URL){

	this.getRecentPosts = function(page) {
		var deferred = $q.defer();

		$http.jsonp(WORDPRESS_API_URL + 'get_recent_posts/' +
		'?page='+ page +
		'&callback=JSON_CALLBACK')
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(data) {
			deferred.reject(data);
		});

		return deferred.promise;
	};


	this.getPost = function(postId) {
		var deferred = $q.defer();

		$http.jsonp(WORDPRESS_API_URL + 'get_post/' +
		'?post_id='+ postId +
		'&callback=JSON_CALLBACK')
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(data) {
			deferred.reject(data);
		});

		return deferred.promise;
	};

	this.shortenPosts = function(posts) {
		//we will shorten the post
		//define the max length (characters) of your post content
		var maxLength = 500;
		return _.map(posts, function(post){
			if(post.content.length > maxLength){
				//trim the string to the maximum length
				var trimmedString = post.content.substr(0, maxLength);
				//re-trim if we are in the middle of a word
				trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("</p>")));
				post.content = trimmedString;
			}
			return post;
		});
	};

	this.sharePost = function(link){
		window.plugins.socialsharing.share('Check this post here: ', null, null, link);
	};

})

;
