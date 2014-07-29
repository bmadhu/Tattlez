/**
 * Created by Reddy on 27-07-2014.
 */
exports.getallUsers = function(db){
return function(req,res) {
// find everything
    db.users.find(function (err, docs) {
    	// docs is an array of all the documents in users
    	if (docs) {
    		res.jsonp(docs);
    		res.end();
    	}
    	else {
    		res.jsonp('{}');
    		res.end();
    	}
        if(err){
            console.log(err);
        }
    });
}
};

exports.getUserIdByMobileNumber=function(db){
  return function(req,res){
      console.log(req.params.mobileNumber);
      db.users.find({mobileNumber:req.params.mobileNumber},function(err,doc){
          res.send(doc[0]._id.toString());
          res.end();
          if(err)
          console.log(err);
      })
  }
};

exports.addUser = function(db){
    return function(req,res) {
// find everything
        var doc = req.body;
        db.users.find({mobileNumber:doc.mobileNumber},function(err,docs){
            if(docs.length<1){
                db.users.insert(doc, function (err, docs) {
                 // docs is an array of all the documents in users
                    res.jsonp('');
                    res.end();
                 if(err){
                 console.log(err);
                     res.jsonp('');
                     res.end();
                 }
                 });
            }
            if(err){
                console.log(err);
                res.jsonp('');
                res.end();
            }
            if(docs.length>0){
                res.jsonp(null);
                res.end();
            }
        });

    }
};
