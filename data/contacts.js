/**
 * Created by Reddy on 28-07-2014.
 */
exports.addContact = function(db){
    return function(req,res) {
// find everything
        var doc = req.body;
        db.contacts.find({contactNumber:doc.contactNumber},function(err,docs){
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
// find everything
        db.users.find({mobileNumber:req.params.mobileNumber},function(err,doc){
            var userId = doc[0]._id.toString();
            db.contacts.find({userId:userId},function(err,docs){
                if(err)console.log(err);
                res.jsonp(docs);
                res.end();
            });
        });

    }
};