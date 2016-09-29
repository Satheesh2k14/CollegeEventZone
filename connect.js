var mongodb = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
//tables
var users;
var events;
var seminar;
var project;
var shortfilm;
//variables
var type;
var numItems;
app.use(express.static(path.join(__dirname, './')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var uri = 'mongodb://satheesh:satheesh@ds041566.mlab.com:41566/actors';

mongodb.MongoClient.connect(uri, function (err, db) {

    if (err) throw err;
    users = db.collection('users');
    events = db.collection('events');
    seminar = db.collection('seminar');
    project = db.collection('project');
    shortfilm = db.collection('shortfilm');
    // / table

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'register.html'));
    });

    app.get('/log', function (req, res) {
        res.sendFile(path.join(__dirname, 'login.html'));
    });
    // signup
    app.post('/signup', function (req, res) {

        users.find({"_id": req.body._id}).count().then(function (numItems) {
            console.log(numItems);
            if (!numItems) {
                users.insert(req.body, function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
            }
            else {
                console.log('User Already Exists');
                res.status('500').send('showAlert');
            }
        });

    });

    app.post('/login', function (req, res) {
        users.find({"_id": req.body._id, "password": req.body.password}).count().then(function (numItems) {
            if (numItems) {
                console.log('Login Successful');
                var myCursor = users.find({_id: req.body._id});
                myCursor.next().then(function (items) {
                    console.log(items);
                    type = items.type;
                    console.log(type);
                    res.status('200').send(type)
                });
            }
            else {
                console.log('User does not exist');
                res.status('500').send('showAlert');
            }
        });
    });

    //STUDENT SEMINAR POST
    app.post('/seminarpost', function (req, res) {
        console.log('trying to enter event');
        events.find({"_id": req.body._id}).count().then(function (numItems) {
            console.log(numItems);
            if (!numItems) {
                var eventBody = {
                    "_id": req.body._id,
                    "type": req.body.type,
                    "status": "unconfirmed"
                }
                console.log(eventBody);
                events.insert(eventBody, function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
                // SEMINAR TABLE POPULATION
                var semBody = {
                    "_id": req.body._id,
                    "semname": req.body.seminarName,
                    "semvenue": req.body.semVenue,
                    "semdate": req.body.semDate
                }
                console.log(semBody);
                seminar.insert(semBody, function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
            }
            else {
                console.log('Seminar already Exists');
                res.status('500').send('showSeminar');
            }
        });
    });

    //ShORT FILM POST
    app.post('/sfpost', function (req, res) {
        console.log('trying to enter event');
        events.find({"_id": req.body._id}).count().then(function (numItems) {
            console.log(numItems);
            if (!numItems) {
                var eventBody = {
                    "_id": req.body._id,
                    "type": req.body.type,
                    "status": "unconfirmed"
                }
                console.log(eventBody);
                events.insert(eventBody, function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
                //SHORTFILM TABLE POPULATION
                var sfBody = {
                    "_id": req.body._id,
                    "sfname": req.body.sfname,
                    "sflink": req.body.sflink
                }
                console.log(sfBody);
                shortfilm.insert(sfBody, function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
            }
            else {
                console.log('Short film already Exists');
                res.status('500').send('showSeminar');
            }
        });
    });

    //PROJECT POST
    app.post('/projectpost', function (req, res) {
        console.log('trying to enter project');
        events.find({"_id": req.body._id}).count().then(function (numItems) {
            console.log(numItems);
            if (!numItems) {
                var eventBody = {
                    "_id": req.body._id,
                    "type": req.body.type,
                    "status": "unconfirmed"
                }
                console.log(eventBody);
                events.insert(eventBody, function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
                //PROJECT TABLE POPULATIOn
                var pBody = {
                    "_id": req.body._id,
                    "pname": req.body.pname,
                    "plink": req.body.plink
                }
                console.log(pBody);
                project.insert(pBody, function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
            }
            else {
                console.log('Project already Exists');
                res.status('500').send('showSeminar');
            }
        });
    });

    // ADMIN RETRIEVE
    app.post('/admin', function (req, res) {
        console.log('naan admin');
        events.find({"status": "unconfirmed"}).toArray(function (err, doc) {
            if (err)throw err;
            doc.forEach(function (d) {
                console.log(d);
                events.update(
                    {_id: d._id},
                    {
                        status: "confirmed",
                        type: d.type
                    },
                    {upsert: true})
            })
            res.status(200).send(doc);
        });
    });

    //FILM MAKER DISPLAY SHORTFILMS
    app.post('/filmmaker', function (req, res) {
        console.log('naan filmmaker');
        shortfilm.find().toArray(function (err, doc) {
            console.log(doc);
            if (err)throw err;
            res.status(200).send(doc);
        });
    });

    //FILM MAKER UPDATE RATING
    app.post('/updaterating', function (req, res) {
        console.log('ratinnggg');
        shortfilm.find().toArray(function (err, doc) {
            if (err)throw err;
            doc.forEach(function (d) {
                console.log(req.body.n);
                shortfilm.update(
                    {_id: d._id},
                    {
                        sfname: d.sfname,
                        sflink: d.sflink,
                        rating: req.body.n
                    },
                    {upsert: true})
            })
            res.status(200).send(doc);
        });
    });

    //industrialist
    app.post('/industrialist', function (req, res) {
        console.log('naan project');
        project.find().toArray(function (err, doc) {
            console.log(doc);
            if (err)throw err;
            res.status(200).send(doc);
        });
    });

    app.post('/updateratingProject', function (req, res) {
        console.log('ratinnggg');
        project.find().toArray(function (err, doc) {
            if (err)throw err;
            doc.forEach(function (d) {
                console.log(req.body.n);
                project.update(
                    {_id: d._id},
                    {
                        pname: d.sfname,
                        plink: d.sflink,
                        rating: req.body.n
                    },
                    {upsert: true})
            })
            res.status(200).send(doc);
        });
    });

    //recruiter
    app.post('/recruiter', function (req, res) {
        console.log('recruiting');
        var cursor = shortfilm.find().sort({rating: -1}).limit(1);
        cursor.next().then(function (data) {
            console.log(data);
            res.status(200).send(data);
        });
    });

    app.post('/recruiter2', function (req, res) {
        console.log('recruiting');
        var cursor = project.find().sort({rating: -1}).limit(1);
        cursor.next().then(function (data) {
            console.log(data);
            res.status(200).send(data);
        });
    });
});


app.listen(3001, function () {
    console.log('Example app listening on port 3000!');
});
