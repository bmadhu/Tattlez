/**
 * Created by Reddy on 28-07-2014.
 */
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('contactsSrvc', function ($http, $q, joinSrvc) {
        function getallContacts(){
            var future = $q.defer();
            $http.jsonp('/contacts/getallContacts/'+joinSrvc.mobileAndOtp.mobileNumber+'?callback=JSON_CALLBACK').success(function(data){
                future.resolve(data);

            },function(err){future.reject(err);});
            return future.promise;
        }

        return {
            getallContacts: getallContacts
        };
    });
});
