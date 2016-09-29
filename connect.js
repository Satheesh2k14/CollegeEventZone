var mongodb = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var users;
var type;
var numItems;
app.use(express.static(path.join(__dirname, './')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


var uri = 'mongodb://satheesh:satheesh@ds041566.mlab.com:41566/actors';

mongodb.MongoClient.connect(uri, function(err, db) {
  
	if(err) throw err;
	users = db.collection('users');
 
 	// / table

	app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'register.html'));
 	});

	app.get('/log', function (req, res) {
    res.sendFile(path.join(__dirname, 'login.html'));
 	});
	// signup
	app.post('/signup', function (req, res) {
		
		users.find({ "_id" : req.body._id}).count().then(function(numItems){
			console.log(numItems);
			if(!numItems){
					users.insert(req.body, function(err, result){
				    if(err){
				    	throw err;
				 	}
				  }); 
			}
			else
			{
				console.log('User Already Exists');
				res.status('500').send('showAlert');
			}
		});		
	
	}); 

	app.post('/login', function(req, res){
		users.find({"_id" : req.body._id , "password" : req.body.password}).count().then(function(numItems){
			if(numItems){
				console.log('Login Successful');
				var myCursor = users.find( { _id : req.body._id } );
				myCursor.next().then(function(items){
					console.log(items);
					type = items.type;
					console.log(type);
					res.status('200').send(type)
				});
							}
			else{
				console.log('User does not exist');
				res.status('500').send('showAlert');
			}
		});
	});
 
});


app.listen(3001, function () {
  console.log('Example app listening on port 3000!');
});
