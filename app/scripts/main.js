/**
 * Created by Reddy on 05-07-2014.
 */
require.config({

    // alias libraries paths
	paths: {
		'jquery':'../vendor/jquery/dist/jquery.min',
        'angular': '../vendor/angular/angular',
        'angular-route': '../vendor/angular-route/angular-route',
        'angular-ui-router': '../vendor/angular-ui-router/release/angular-ui-router',
        'domReady': '../vendor/requirejs-domready/domReady',
		'angular-bootstrap':'../vendor/angular-bootstrap/ui-bootstrap-tpls.min',
		'text-angular': './vendorjs/textAngular/textAngular',
		'text-angular-setup': './vendorjs/textAngular/textAngularSetup',
        'text-angular-sanitize':'./vendorjs/textAngular/textAngular-sanitize',
        'ng-audio':'../vendor/angular-audio/app/angular.audio'
    },
    // angular does not support AMD out of the box, put it in a shim
	shim: {
		'jquery': {
			exports:'$'
		},
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-ui-router':{
            deps:['angular']
        },
        'angular-bootstrap': {
			deps:['angular']
        },
        'text-angular-sanitize':{
            deps:['angular']
        },
        'text-angular-setup': {
        	deps:['angular']
        },
        'text-angular': {
            deps:['angular']
        },
        'ng-audio':{
        	deps:['angular']
        }
        
    },
    // kick start application
    deps: ['./appStart']
});
