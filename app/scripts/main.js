/**
 * Created by Reddy on 05-07-2014.
 */
require.config({

    // alias libraries paths
    paths: {
        'angular': '../vendor/angular/angular',
        'angular-route': '../vendor/angular-route/angular-route',
        'angular-ui-router': '../vendor/angular-ui-router/release/angular-ui-router',
        'domReady': '../vendor/requirejs-domready/domReady',
        'jquery': '../vendor/jquery/dist/jquery.min',
        'bootstrap': '../vendor/bootstrap/dist/js/bootstrap.min',
		'angular-bootstrap':'../vendor/angular-bootstrap/ui-bootstrap-tpls.min'

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
        },
        'angular-ui-router':{
            deps:['angular']
        },
        'angular-bootstrap': {
			deps:['angular']
        }


    },
    // kick start application
    deps: ['./appStart']
});
