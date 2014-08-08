/**
 * Created by Reddy on 15-07-2014.
 */
var express = require('express');
var bodyParser = require('body-parser');
var databaseUrl = "mongodb://srikanth:6036@novus.modulusmongo.net:27017/Q4apupob"; // "username:password@example.com/mydb"
var collections = ["users","contacts","communications"];//["users","reports"]
var db = require("mongojs").connect(databaseUrl, collections);
var usersData = require('./data/users');
var contactsData = require('./data/contacts');
var communicationsData = require('./data/communications');
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//Create a static file server
app.use(express.static(__dirname+'/app'));

/*REST API*/
app.get('/users/getall',usersData.getallUsers(db));
app.get('/users/getUserIdByMobileNumber/:mobileNumber',usersData.getUserIdByMobileNumber(db));
app.post('/users/addUser',usersData.addUser(db));
app.get('/contacts/getAllContacts/:userId', contactsData.getContactsByUserId(db));
app.post('/contacts/addContact', contactsData.addContact(db));
app.post('/contacts/deleteContact', contactsData.deleteContact(db));
app.get('/communications/getCommunicationId/:userId/:contactId', communicationsData.getCommunicationId(db));

/*Start express server*/
var port = process.env.PORT||3000;
app.listen(port);
console.log('express server started on port %s',port);