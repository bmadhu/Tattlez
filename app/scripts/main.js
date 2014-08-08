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
		'angular-bootstrap':'../vendor/angular-bootstrap/ui-bootstrap-tpls.min',
        'text-angular':'../vendor/textAngular/dist/textAngular.min',
        'text-angular-sanitize':'../vendor/textAngular/dist/textAngular-sanitize.min'
    },
    // angular does not support AMD out of the box, put it in a shim
    shim: {
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
        'text-angular': {
            deps:['angular']
        }
    },
    // kick start application
    deps: ['./appStart']
});
