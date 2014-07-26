/**
 * Created by bindum on 24/7/14.
 */

var otpCtrl = function ($rootScope, $scope, $state, $timeout, configSrvc, joinSrvc) {
    $scope.enableResendOtp = false;
    $scope.showAlert = false;
    $scope.otpInput;

    // Displays Resend Otp button after timeout
    $scope.$on("UPDATE_OTP", function (event) {
        $scope.enableResendOtp = true;
    });
alert(joinSrvc.mobileAndOtp.otp);
    // Validates OTP - if valid - go to history page else shows error alert
    $scope.validateOtp = function (otp) {
        if (joinSrvc.mobileAndOtp.otp && joinSrvc.mobileAndOtp.otp ==  $scope.otpInput) {
            $state.go('history');
        } else{
            $scope.showAlert =true;
            $scope.otpInput = null;
            $timeout(function () {
                $scope.showAlert = false;
            }, configSrvc.alertDelay);
        }
    };

    //Generates new OTP
    $scope.resendOtp = function () {
        joinSrvc.setOtp();
        $scope.enableResendOtp = false;
    };

    //Go to join form
    $scope.gotoJoinForm = function () {
        $state.go('join');
    };
};