define(['../modules/services'], function (services) {
'use strict';

    services.factory('guid', function() {
        		function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                return {
                    newguid: function() {
                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4();
                    }
                };
    });
});