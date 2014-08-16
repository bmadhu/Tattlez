exports.addMessage = function (db) {
    return function (req, res) {
        var doc = req.body;
        db.messages.insert(doc, function (err, docs) {
            if (err) console.log(err);
            res.send('OK');
            res.end();
        });
    }
};