/**
 * Created by bindum on 26/7/14.
 */
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('joinSrvc', function ($rootScope, $timeout, configSrvc) {
        var mobileAndOtp = {}; //object to save mobile number and OTP

        // Sets mobile number from join form
        function setMobileNumber (mobileNumber) {
            mobileAndOtp.mobileNumber = mobileNumber;
        }

        /**
         * Generates 4 digit random number
         * Broadcasts Event to generate new OTP
         */
        function setOtp () {
            mobileAndOtp.otp = Math.floor(Math.random()*10000);
            $timeout(function (){
                mobileAndOtp.otp = null;
                $rootScope.$broadcast("UPDATE_OTP");
            }, configSrvc.otpDelay);
        }

        // Gets mobile and OTP object
        function getMobileAndOtp () {
            return mobileAndOtp;
        }

        return {
            setMobileNumber: setMobileNumber,
            setOtp: setOtp,
            getMobileAndOtp: getMobileAndOtp,
            mobileAndOtp: mobileAndOtp
        };
    });
});
