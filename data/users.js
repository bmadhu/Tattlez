/**
 * Created by Reddy on 27-07-2014.
 */
exports.getallUsers = function(db){
return function(req,res) {
// find everything
    db.users.find(function (err, docs) {
        // docs is an array of all the documents in users
        console.log(docs);
        res.jsonp(docs);
        res.end();
        if(err){
            console.log(err);
        }
    });
}
};
exports.addUser = function(db){
    return function(req,res) {
// find everything
        console.log(req.body);
        var doc = req.body;
        db.users.insert(doc, function (err, docs) {
            // docs is an array of all the documents in users
            console.log(docs);
            res.jsonp('{}');
            res.end();
            if(err){
                console.log(err);
            }
        });
    }
};
