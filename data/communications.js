/**
 * Created by Reddy on 08-08-2014.
 */
exports.getCommunicationId = function (db) {
	return function (req, res) {
		var doc = {};
		doc.userId = req.params.userId;
		doc.contactId = req.params.contactId;
		db.communications.find(doc, function (err, docs) {
			if (docs.length < 1) {
				db.communications.insert(doc, function (err, docs) {
					res.send(doc);
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
				res.send(docs);
				res.end();
			}
		});

	}
};
