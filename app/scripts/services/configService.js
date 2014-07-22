/**
 * Created by Reddy on 05-07-2014.
 */
define(['../modules/services'], function (services) {
	'use strict';
	services.factory('configSrvc', function () {
		return {
			phoneTablet: "phone"//options:"phone","tablet"
		};
	});
});
