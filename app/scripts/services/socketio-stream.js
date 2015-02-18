define(['../modules/services'], function (services) {
'use strict';

    services.provider('socketiostream', function() {
        var socketiostream = io.connect('/user');


        return {
            $get: function () {
                return socketiostream;
            }
        };
    });
});