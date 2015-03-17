/**
 * Created by Reddy on 15-07-2014.
 */
var express = require('express');
var bodyParser = require('body-parser');
var databaseUrl = "mongodb://srikanth:6036@proximus.modulusmongo.net:27017/nytoR8ux";
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
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
/*End socket.io configuration*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//Create a static file server
app.use(express.static(__dirname + '/app'));
Array.prototype.contains = function(k, callback) {
    var self = this;
    return (function check(i) {
        if (i >= self.length) {
            return callback(false);
        }

        if (self[i] === k) {
            return callback(true);
        }

        return process.nextTick(check.bind(null, i+1));
    }(0));
};
/* Start socket.io for Audio/Video chat */
var rooms = {},
    userIds = {};
var Chat = io
  .of('/AV')
  .on('connection', function (socket) {
  	var currentRoom, id;

    socket.on('init', function (data, fn) {
      currentRoom = data.room;
      console.log(data.room);
      id=data.userId;
      var room = rooms[currentRoom];
      if (!data.joiner) {
        rooms[currentRoom] = [socket];
        userIds[currentRoom] = [data.userId];
        
        fn(currentRoom, id);
        console.log('Room created, with #', currentRoom);
      } else {
        if (!room) {
          return;
        }
        userIds[currentRoom].push(data.userId);
        
        fn(currentRoom, id);
        room.forEach(function (s) {
          s.emit('peer.connected', { id: id });
        });
        room.push(socket);
        console.log(userIds);
        console.log('Peer connected to room', currentRoom, 'with #', id);
      }
    });

    socket.on('msg', function (data) {
      var to = data.to;
      
      if (rooms[currentRoom] && userIds[currentRoom].indexOf(to) > -1) {
        console.log('Redirecting message to', to, 'by', data.by);
        var socketIndex = userIds[currentRoom].indexOf(to);
        console.log(socketIndex);
        rooms[currentRoom][socketIndex].emit('msg', data);
      } else {
        console.warn('Invalid user');
      }
    });

    socket.on('disconnectRoom', function (fn) {
    	console.log(currentRoom);
      if (!currentRoom || !rooms[currentRoom]) {
        return;
      }
      delete rooms[currentRoom][rooms[currentRoom].indexOf(socket)];
      fn(currentRoom,id);
      rooms[currentRoom].forEach(function (socket) {
        if (socket) {
          socket.emit('peer.disconnected', { id: id });
        }
      });
    });
  });
/* End socket.io for Audio/Video chat*/
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
      		console.log(joinedRoom);
      		socket.broadcast.to(joinedRoom[data.communicationId]).send(data);
          } else {
              socket.send(
			   "you're not connected to chat." +
			   "select a contact and then start chat."
			);
          }
      });
      socket.on('call', function (data) {
      	if (joinedRoom[data.communicationId]) {
      		console.log('comm id');
              console.log(joinedRoom[data.communicationId]);
      		// Broadcasts the message to the other contact
      		console.log(joinedRoom);
      		socket.broadcast.to(joinedRoom[data.communicationId]).emit('call',data);
          } else {
              socket.send(
			   "you're not connected to chat." +
			   "select a contact and then start chat."
			);
          }
      });
      socket.on('endcall', function (data) {
      	if (joinedRoom[data.communicationId]) {
      		console.log('comm id');
              console.log(joinedRoom[data.communicationId]);
      		// Broadcasts the message to the other contact
      		console.log(joinedRoom);
      		socket.broadcast.to(joinedRoom[data.communicationId]).emit('endcall',data);
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
			console.log(joinedRoom);
			socket.leave(socket.username);
			delete joinedRoom[socket.username];
			console.log('disconnect');
			console.log(joinedRoom);
		}
	 });
	 
  });
  /*End socket.io initialization*/
/*Start socket.io-stream initialization*/
var str = io.of('/user').on('connection', function (socket) {
	ss(socket).on('profile-image', function (stream, data) {
		var filename = path.basename(data.name);
        var directory = "app/files/profile-pics/"+data.profileId;
        fs.exists(directory,function(exists){
            if(exists){
            	fs.readdirSync(directory).forEach(function(file,index){
			      var curPath = directory + "/" + file;
			        fs.unlinkSync(curPath);
			    });
                stream.pipe(fs.createWriteStream(directory+"/"+filename));
                fs.watchFile(directory+"/"+filename, function (curr, prev) {
                    fs.readFile(directory+"/"+filename, function (err, buffer) {
                        ss(socket).emit('profileImage', { buffer: buffer,path:directory+"/"+filename,filename:filename });
                    });
                });
            }
            else{
                mkdirp(directory, function(err){
                    if( err ){
                        console.log(err);
                    }
                    else {
                        stream.pipe(fs.createWriteStream(directory+"/"+filename));
                        fs.watchFile(directory+"/"+filename, function (curr, prev) {
                            fs.readFile(directory+"/"+filename, function (err, buffer) {
                                ss(socket).emit('profileImage', { buffer: buffer,path:directory+"/"+filename,filename:filename });
                            });
                        });
                    }
                });
            }

        });
		/*console.log(data.name);
		console.log(stream);
		stream.pipe(fs.createWriteStream("app/files/profile-pics/"+data.profileId+"/"+filename));*/
	});
	ss(socket).on('communication-files', function (stream, data) {
		var filename = path.basename(data.name);
		
		var directory = "app/files/communication-files/"+data.communicationId+"/"+data.from;
		fs.exists(directory,function(exists){
			if(exists){
				stream.pipe(fs.createWriteStream(directory+"/"+filename));
				fs.watchFile(directory+"/"+filename, function (curr, prev) {
					fs.readFile(directory+"/"+filename, function (err, buffer) {
						ss(socket).emit('image', { buffer: buffer,path:directory+"/"+filename,filename:filename });
					});
				});
			}
			else{
				mkdirp(directory, function(err){
					if( err ){
						console.log(err);
					}
					else {
						stream.pipe(fs.createWriteStream(directory+"/"+filename));
						fs.watchFile(directory+"/"+filename, function (curr, prev) {
							fs.readFile(directory+"/"+filename, function (err, buffer) {
								ss(socket).emit('image', { buffer: buffer,path:directory+"/"+filename,filename:filename });
							});
						});
					}
				});
			}
			
		});
		
	});
});
/*End socket.io-stream initialization*/
/*REST API*/
app.get('/users/getall',usersData.getallUsers(db));
app.get('/users/getUserIdByMobileNumber/:mobileNumber',usersData.getUserIdByMobileNumber(db));
app.post('/users/addUser',usersData.addUser(db));
app.post('/users/updateUser',usersData.updateUser(db,mongojs));
app.get('/contacts/getAllContacts/:userId', contactsData.getContactsByUserId(db,mongojs));
app.post('/contacts/addContact', contactsData.addContact(db));
app.post('/contacts/deleteContact', contactsData.deleteContact(db));
app.get('/communications/getCommunicationId/:loginNumber/:contactNumber', communicationsData.getCommunicationId(db));
app.get('/contacts/getChatContactDetails/:contactId', contactsData.getChatContactDetails(db, mongojs));
app.post('/messages/addMessage',messagesData.addMessage(db));
app.post('/users/getUserByUserId/:userId',usersData.getUserByUserID(db,mongojs));
app.get('/messages/getMessagesByCommunicationId/:communicationId',messagesData.getMessagesByCommunicationId(db));
/*Start express server*/
var port = process.env.PORT||3000;
server.listen(port);
console.log('express server started on port %s',port);