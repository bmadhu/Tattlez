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
		});
	};
};

exports.getHistoryByUser=function(db){
	return function(req,res){
		var CommIds = req.body;
		var recentMsgOfEachContact=[];
		var cnt=0;
		CommIds.forEach(function(comm,index){
			
			if(comm){
				db.messages.find({communicationId:comm.communicationId}).limit(1).sort({on:-1},function(err,msgDocs){
					if(msgDocs.length>0){
						recentMsgOfEachContact.push(msgDocs[0]);
					}
					cnt ++;
					if(cnt == CommIds.length){
						res.send(recentMsgOfEachContact);
						res.end();
					}
					if(err){
						console.log(err);
					}
				});
			}
			
		});
		
	};
};
