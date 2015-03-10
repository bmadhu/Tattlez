define(['../modules/services'], function (services) {
'use strict';

    services.provider('socketroom', function() {
        var socketroom = io.connect("/AV");
		
        

        socketroom.on('create', function(data) {
            
        });

        socketroom.on('delete', function(data) {
            
        });


        return {
            $get: function () {
                return socketroom;
            }
        };
    });
});