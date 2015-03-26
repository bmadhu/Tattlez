/**
 * Created by bindu on 24/03/15.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('ContactInfoCtrl', function ($scope, $state, contactsSrvc, joinSrvc) {
        $scope.contactInfo = {};
        // Fetches the contact Id
        $scope.contactId = contactsSrvc.getSelectedContactForInfo();

        //get the contact details to display
        if($scope.contactId) {
            contactsSrvc.getChatContactDetails($scope.contactId).then(function(data){
                // gets all the contact details except status.
                $scope.contactInfo=data[0];

                /**
                 * For individual contacts show the status
                 * For group, show all the members and their statuses.
                 */
                if (!$scope.contactInfo.group) {
                    //Get contact id based on his mobile number.
                    joinSrvc.getUserIdByContactMobileNumber($scope.contactInfo.contactNumber).then(function(userId){
                        // Now get profile status from this
                        joinSrvc.getUserByUserId(userId).then(function (userdata){
                            $scope.contactInfo.status = userdata.profileStatus;
                        });
                    });
                }
            });
        }

        $scope.gotoContacts = function () {
            $state.go("contacts");
        }

        $scope.gotoHistory = function () {
            $state.go("history");
        }

    });
});