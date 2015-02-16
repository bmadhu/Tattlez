exports.addMessage = function (db) {
    return function (req, res) {
        var doc = req.body;
        db.messages.insert(doc, function (err, docs) {
            if (err) console.log(err);
            res.send('OK');
            res.end();
        });
    };
};

exports.getMessagesByCommunicationId=function(db){
	return function(req,res){
		db.messages.find({communicationId:req.params.communicationId},function(err,doc){
			res.send(doc);
			res.end();
			if(err){
				console.log(err);
			}
		})
	}
}