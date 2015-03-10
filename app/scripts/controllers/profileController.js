/**
 * Created by bindu on 22/02/15.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('profileCtrl', function ($scope, $state, $timeout, guid, joinSrvc, socketiostream) {

        var userNumber;
        $scope.userProfile = {};
        $scope.editorEnabled = false;

        joinSrvc.getUserByUserId().then(function(userdata){
            console.log(userdata);
            userNumber = userdata.mobileNumber;
            $scope.userProfile.profileImgUrl = userdata.profilePic;
            $scope.userProfile.profileName = userdata.profileName;
            $scope.userProfile.profileStatus = userdata.profileStatus;
        });

        $scope.uploadProfilePic = function(files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var newGuid = guid.newguid();
                    var stream = ss.createStream();
                    if (file.type.indexOf('image') > -1) {
                        var fileTypeSplit = (file.name).split('.');
                        var fileType = fileTypeSplit[fileTypeSplit.length - 1];
                        var fileName = newGuid + "." + fileType;

                        // upload a file to the server.
                        var data = { name: fileName, profileId: userNumber, mediaType: file.type };
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = function (e) {
                            $timeout(function () {
                                $scope.userProfile.profileImgUrl = e.target.result;
                                ss(socketiostream).emit('profile-image', stream, data);

                                var blobStream = ss.createBlobReadStream(file);
                                blobStream.pipe(stream);
                            });
                        };
                    }
                }
            }
        };

        ss(socketiostream).on('profileImage', function (data) {
            $timeout(function () {
                var fileTypeSplit = (data.filename).split('.');
                var guid = fileTypeSplit[0];
                $scope.userProfile.profileImgUrl = (data.path).replace('app','..');
            }, 0);

        });

        $scope.saveUserProfile = function() {
            var userdata = {};
            userdata.userId = joinSrvc.getUserId();
            userdata.profilePic = $scope.userProfile.profileImgUrl;
            userdata.profileName = $scope.userProfile.profileName;
            userdata.profileStatus = $scope.userProfile.profileStatus;
            joinSrvc.updateUser(userdata).then(function(result){
                if (result == 'OK') {
                    console.log("userProfile updated successfully");
                }
            });
        }

        $scope.gotoSettings = function() {
            $state.go('settings');
        }
        $scope.gotoHistory = function() {
            $state.go('history');
        }

    });
});