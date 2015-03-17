/**
* Created by Reddy on 28-07-2014.
*/
exports.addContact = function (db) {
    return function (req, res) {
        // find everything
        var doc = req.body;
        db.contacts.find({ contactNumber: doc.contactNumber, userId: doc.userId }, function (err, docs) {
            if (docs.length < 1) {
                db.contacts.insert(doc, function (err, docs) {
                    // docs is an array of all the documents in users
                    res.send('OK');
                    res.end();
                    if (err) {
                        console.log(err);
                    }
                });
            }
            if (err) {
                console.log(err);
            }
            if (docs.length > 0) {
                res.send('Contact number already exists');
                res.end();
            }
        });
    }
};

exports.deleteContact = function (db) {
    return function (req, res) {
        var doc = req.body;
        db.contacts.remove({ contactNumber: doc.contactNumber, userId: doc.userId }, function (err, docs) {
            if (err) console.log(err);
            res.send('OK');
            res.end();
        });
    }
};

exports.getContactsByUserId = function (db,mongojs) {
    return function (req, res) {
        var docs = [];
        var internalCnt = 0;
        var totalCnt = 0;
        db.contacts.find({ userId: req.params.userId }).forEach(function (err, doc) {
            if (err) console.log(err);
            if (!doc) {
				if(totalCnt == 0){
					res.jsonp(null);
					res.end();
				}
            }
            if (doc) {
                totalCnt++;
                var contact = {};
                contact.contactName = doc.contactName;
                contact.contactNumber = doc.contactNumber;
                contact.id = doc._id.toString();
                contact.ispoen = false; //to control drop-down menu in html page.
                contact.group = doc.group;
                if(doc.groupAdmin)
                	contact.groupAdmin = doc.groupAdmin;
                // if (doc.contactNumber) {
                
                db.users.find({ mobileNumber: doc.contactNumber }, function (uerr, udoc) {
                    if (uerr) console.log(uerr);

                    if (udoc.length > 0)
                     contact.photo = udoc[0].profilePic;
                    else
                        contact.photo = '../images/default_profile_M.jpg';
                    docs.push(contact);
                    internalCnt++;
                    if (internalCnt == totalCnt) {
                    	
                        res.jsonp(docs);
                        res.end();
                    }
                });
            }
            //}

        });
    }
};

exports.getChatContactDetails = function (db, mongojs) {
    return function (req, res) {
        var contactId = req.params.contactId;
        var docs = [];
        var internalCnt = 0;
        var totalCnt = 0;
        db.contacts.find({ _id: mongojs.ObjectId(contactId) }).forEach(function (err, doc) {
            if (err) {
                res.jsonp(err);
                res.end();
            }
            else {
               if (!doc) {
					if(totalCnt == 0){
						res.jsonp(null);
						res.end();
					}
            	}
            if (doc) {
            	
                totalCnt++;
                var contact = {};
                contact.contactName = doc.contactName;
                contact.contactNumber = doc.contactNumber;
                contact.id = doc._id.toString();
                contact.ispoen = false; //to control drop-down menu in html page.
                contact.group = doc.group;
                // if (doc.contactNumber) {
                
                db.users.find({ mobileNumber: doc.contactNumber}, function (uerr, udoc) {
                    if (uerr) console.log(uerr);
                    if (udoc.length > 0)
                        contact.photo = udoc[0].profilePic;
                    else
                        contact.photo = '../images/default_profile_M.jpg';
                    docs.push(contact);
                    internalCnt++;
                    if (internalCnt == totalCnt) {
                    	
                        res.jsonp(docs);
                        res.end();
                    }
                });
            }
            }
        });
    }
};