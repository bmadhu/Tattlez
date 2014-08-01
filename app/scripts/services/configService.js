/**
 * Created by Reddy on 05-07-2014.
 */
define(['../modules/services'], function (services) {
	'use strict';
	services.factory('configSrvc', function () {
		return {
			phoneTablet: "tablet", //options:"phone","tablet"
			otpDelay: 30000, //timeout delay for otp validation
			alertDelay: 5000, //timeout delay for otp alert
			uidLocalStorage:"_id_tattlez"
		};
	});
});
