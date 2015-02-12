/**
 * Created by Reddy on 08-08-2014.
 */
exports.getCommunicationId = function (db) {
	return function (req, res) {
		var doc = {};
		console.log(req.params.loginNumber);
		doc.loginNumber = req.params.loginNumber;
		doc.contactNumber = req.params.contactNumber;
		db.communications.find({loginNumber: doc.loginNumber, contactNumber: doc.contactNumber}, function (err, udoc) {
			if (udoc.length > 0) {
               res.send(udoc);
               res.end();
			}else{
                db.communications.find({loginNumber: doc.contactNumber, contactNumber: doc.loginNumber}, function (err, udoc) {
                    if(udoc.length > 0) {
                        res.send(udoc);
                        res.end();
                    } else {
                        var sdoc = {};
                        sdoc.loginNumber = doc.loginNumber;
                        sdoc.contactNumber = doc.contactNumber;
                        db.communications.insert(sdoc, function (err, docs) {
                            res.send(docs);
                            res.end();
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            }
			if (err) {
				console.log(err);
			}
		});

	}
};
