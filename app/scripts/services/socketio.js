define(['../modules/services'], function (services) {
'use strict';

    services.provider('socketio', function() {
        var socketio = io.connect("/chat");

        socketio.on('message', function(data) {
            
        });

        socketio.on('create', function(data) {
            
        });

        socketio.on('delete', function(data) {
            
        });


        return {
            $get: function () {
                return socketio;
            }
        };
    });
});