/**
 * Created by Reddy on 15-07-2014.
 */
var express = require('express');
var app = express();

//Create a static file server
app.use(express.static(__dirname+'/app'));

var port = process.env.PORT||3000;
app.listen(port);
console.log('express server started on port %s',port);