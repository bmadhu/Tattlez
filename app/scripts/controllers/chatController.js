/**
 * Created by Reddy on 01/8/14.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('chatCtrl', function ($scope, $state, contactsSrvc, chatSrvc) {
        var joined = false;
        var chat = io.connect('http://localhost:3000/chat');
        //get the contactId of the user to which we are trying to start chat.
        $scope.contactId = contactsSrvc.getSelectedContactForChat();
        $scope.newMsg;
        $scope.msgs = [];

        /**
         * Clicking on Home button will navigate to history page
         */
        $scope.gotoHistory = function () {
            $state.go('history');
        }

        /**
         * Clicking on Back button will navigate to history page
         */
        $scope.gotoContacts = function () {
            $state.go('contacts');
        }

        /**
        * Get details of the contact
        */
        contactsSrvc.getChatContactDetails($scope.contactId).then(function (result) {
            $scope.contactDetails = result[0];
            /**
             * get the communicationId.
             * If the user and the contact has a communicationId established, we'll get that.
             * If the user and the contact don't have communicationId established, then create new and get that.
             */
            chatSrvc.getCommunicationId($scope.contactDetails.contactNumber).then(function (result) {
                console.log(result);
                $scope.communicationId = result[0]._id;
                chat.emit('connected to chat', result[0]._id);
            });
        });

        $scope.addMessage = function (contactId) {
            var doc = {};
            doc.communicationId = $scope.communicationId;
            doc.message = $scope.newMsg;
            $("text-angular div[contenteditable=true]").html('');
            $("textarea").val('');
            chat.emit('message', $scope.newMsg);
            chatSrvc.addMessage(doc).then(function (result) {
                console.log(result);
            });
        };
        chat.on('message', function (msg) {
            $scope.msgs.push(msg);
            console.log($scope.msgs);
        });
    });
});
