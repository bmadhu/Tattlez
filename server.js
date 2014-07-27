/**
 * Created by Reddy on 15-07-2014.
 */
var express = require('express');
var bodyParser = require('body-parser');
var databaseUrl = "Tattlez"; // "username:password@example.com/mydb"
var collections = ["users"];//["users","reports"]
var db = require("mongojs").connect(databaseUrl, collections);
var usersData = require('./data/users');
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//Create a static file server
app.use(express.static(__dirname+'/app'));

app.get('/users/getall',usersData.getallUsers(db));
app.post('/users/addUser',usersData.addUser(db));

var port = process.env.PORT||3000;
app.listen(port);
console.log('express server started on port %s',port);