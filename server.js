/**
 * Created by Reddy on 15-07-2014.
 */
var express = require('express');
var bodyParser = require('body-parser');
var databaseUrl = "mongodb://srikanth:6036@proximus.modulusmongo.net:27017/ijan4eWu";
var collections = ["users", "contacts", "communications", "messages"];
var mongojs = require("mongojs");
var db = mongojs.connect(databaseUrl, collections);
var usersData = require('./data/users');
var contactsData = require('./data/contacts');
var communicationsData = require('./data/communications');
var messagesData = require('./data/messages');
var app = express();
/*Start socket.io configuration*/
var server = require('http').Server(app);
var io = require('socket.io')(server);
/*End socket.io configuration*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//Create a static file server
app.use(express.static(__dirname + '/app'));

/*Start socket.io initialization*/
var Chat = io
  .of('/chat')
  .on('connection', function (socket) {
  	var joinedRoom = {};
  	var addedUser=false;
      socket.on('connected to chat', function (data) {
          socket.username=data;
          socket.join(data);
          joinedRoom[data] = data;
          addedUser=true;
          console.log('connect');
          console.log(data);
      });
      socket.on('message', function (data) {
      	if (joinedRoom[data.communicationId]) {
      		console.log('comm id');
              console.log(joinedRoom[data.communicationId]);
      		// Broadcasts the message to the other contact
      		socket.broadcast.to(joinedRoom[data.communicationId]).send(data);
          } else {
              socket.send(
			   "you're not connected to chat." +
			   "select a contact and then start chat."
			);
          }
      });
      socket.on('disconnect', function () {
		// remove the username from global usernames list
		if (addedUser) {
			socket.leave(socket.username);
			delete joinedRoom[socket.username];
			console.log('disconnect');
			console.log(joinedRoom);
		}
	 });
  });
  /*End socket.io initialization*/

/*REST API*/
app.get('/users/getall',usersData.getallUsers(db));
app.get('/users/getUserIdByMobileNumber/:mobileNumber',usersData.getUserIdByMobileNumber(db));
app.post('/users/addUser',usersData.addUser(db));
app.get('/contacts/getAllContacts/:userId', contactsData.getContactsByUserId(db,mongojs));
app.post('/contacts/addContact', contactsData.addContact(db));
app.post('/contacts/deleteContact', contactsData.deleteContact(db));
app.get('/communications/getCommunicationId/:loginNumber/:contactNumber', communicationsData.getCommunicationId(db));
app.get('/contacts/getChatContactDetails/:contactId', contactsData.getChatContactDetails(db, mongojs));
app.post('/messages/addMessage',messagesData.addMessage(db));
app.post('/users/getUserByUserId/:userId',usersData.getUserByUserID(db,mongojs));
/*Start express server*/
var port = process.env.PORT||3000;
server.listen(port);
console.log('express server started on port %s',port);