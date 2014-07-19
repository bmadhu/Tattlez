/**
 * Created by Reddy on 05-07-2014.
 */
require.config({

    // alias libraries paths
    paths: {
        'angular': '../vendor/angular/angular',
        'angular-route': '../vendor/angular-route/angular-route',
        'domReady': '../vendor/requirejs-domready/domReady',
        'jquery': '../vendor/jquery/jquery',
        'bootstrap': '../vendor/bootstrap-css/js/bootstrap'

    },
    // angular does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'bootstrap':{
            deps:['jquery']
        }


    },
    // kick start application
    deps: ['./bootstrap']
});
