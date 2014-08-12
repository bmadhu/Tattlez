/**
 * Created by bindum on 27/7/14.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('HistoryCtrl', function ($scope, $state) {
        /**
         * Loads contacts page from history
         */
        $scope.loadContacts = function () {
            $state.go('contacts');
        };
        /**
         *  Creating New Chat will navigate to contacts page
         */
        $scope.createNewChat = function () {
            $state.go('contacts');
        }
        /**
         *  Creating New Group will navigate to New group page
         */
        $scope.createNewGroup = function () {
            $state.go('newGroup');
        }
        /**
         *  Creating New broadcast list will navigate to New broadcast list page
         *  where user can broadcast a message to number of contacts
         */
        $scope.createBroadcastList = function () {
            //$state.go('broadcast');
        }
        /**
         *  Navigate to contacts list page.
         */
        $scope.goToContactsPage = function () {
             $state.go('contacts');
        }
        /**
         *  Navigate to settings page, shows a list of menu items
         *  Help, profile, Account, Chat settings, notifications, contacts
         */
        $scope.goToSettingsPage = function () {
            // $state.go('settings');
        }
        /**
         *  Navigate to Status page.
         *  Shows current status with Edit option and other options to select
         */
        $scope.setStatus = function () {
            //$state.go('status');
        }


    });
});
