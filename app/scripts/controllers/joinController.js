define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('JoinCtrl', function ($scope, $state, joinSrvc) {
        $scope.mobileNumber;
        /**
         * Saves mobile number in joinService
         * generates random number
         * navigates to Authenticate page
         */
    	$scope.join = function () {
            joinSrvc.setMobileNumber($scope.mobileNumber);
            joinSrvc.setOtp();
            /*joinSrvc.getallUsers().then(function(response){
                console.log(response);
            },function(err){
                console.log(err);
            });*/
            $state.go('authenticate');
    	};
    });
});
