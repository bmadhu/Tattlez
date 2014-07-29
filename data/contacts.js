/**
 * Created by Reddy on 28-07-2014.
 */
exports.addContact = function(db){
    return function(req,res) {
// find everything
        var doc = req.body;
        db.contacts.find({contactNumber:doc.contactNumber, userId: doc.userId}, function(err,docs) {
            if(docs.length<1){
                db.contacts.insert(doc, function (err, docs) {
                    // docs is an array of all the documents in users
                    res.send('OK');
                    res.end();
                    if(err){
                        console.log(err);
                    }
                });
            }
            if(err){
                console.log(err);
            }
            if(docs.length > 0)
            {
                res.send('Contact number already exists');
                res.end();
            }
        });

    }
};

exports.getContactsByMobileNumber = function(db){
    return function(req,res) {
    	var docs = [];
    	var internalCnt = 0;
    	var totalCnt = 0;
        db.users.find({mobileNumber:req.params.mobileNumber},function(err,doc){
            var userId = doc[0]._id.toString();
            db.contacts.find({ userId: userId }).forEach(function (err, doc) {
            	if (err) console.log(err);
            	if (!doc) {
            		
            	}
            	if (doc) {
            		totalCnt++;
            		var contact = {};
            		contact.contactName = doc.contactName;
            		contact.contactNumber = doc.contactNumber;
            		db.users.find({ mobileNumber: doc.contactNumber }, function (uerr, udoc) {
            			if (uerr) console.log(uerr);
            			if (udoc.length>0)
            				contact.photo = udoc.mobileNumber;
						else
            				contact.photo = 'default_profile_M.jpg';
            			docs.push(contact);
            			internalCnt++;
            			if (internalCnt == totalCnt) {
            				res.jsonp(docs);
            				res.end();
            			}
            		});
            	}
            	
            });
           
        });

    }
};