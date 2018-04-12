var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    engines = require('consolidate'),
    ObjectId = require('mongodb').ObjectID,
    url = 'mongodb://localhost:27017/';

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render("error_template", { error: err});
}

MongoClient.connect(process.env.MONGODB_URI || url,function(err, db){
    console.log('Successfully connected to MongoDB.');
    
    var dbo = db.db('marlabs')
    var users_collection = dbo.collection('users');

    app.get('/users', function(req, res, next) {
        console.log("Received get /users request");
        users_collection.find({}).toArray(function(err, users){
            if(err) throw err;

            if(users.length < 1) {
                console.log("No users found.");
            }

            console.log(users);
            res.json(users);
        });
    });

    app.post('/users', function(req, res, next){
        console.log(req.body);
        users_collection.insert(req.body, function(err, doc) {
            if(err) throw err;
            console.log(doc);
            res.json(doc);
        });
    });

    app.delete('/users/:id', function(req, res, next){
        var id = req.params.id;
        console.log("delete " + id);
        users_collection.deleteOne({'_id': ObjectId(id)}, function(err, results){
            console.log(results);
            res.json(results);
        });
    });

    app.put('/users/:id', function(req, res, next){
        var id = req.params.id;
        users_collection.updateOne(
            {'_id': new ObjectId(id)},
            { $set: {
                'user_id' : req.body.user_id,
                'username' : req.body.username,
                'location': req.body.location,
                'org': req.body.org
                }
            }, function(err, results){
                console.log(results);
                res.json(results);
        });
    });

    app.use(errorHandler);
    var server = app.listen(process.env.PORT || 3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    })
})
