/**
* Created by Reddy on 08-08-2014.
*/
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('VideoStream', function ($q) {
    	var stream;
	    return {
	      get: function () {
	        	navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia ||
               navigator.webkitGetUserMedia || navigator.msGetUserMedia;
	          var d = $q.defer();
	          navigator.getUserMedia({
	            video: true,
	            audio: true
	          }, function (s) {
	            stream = s;
	            d.resolve(stream);
	          }, function (e) {
	            d.reject(e);
	          });
	          return d.promise;
	        
	      }
	    };
    });
});