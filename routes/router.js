var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
var User = require('../models/user');

//GET route for reading data
router.get('/', function (req, res, next) {
	return res.sendFile('/views/login.html', {root: './'});
});

router.post('/', function(req, res, next) {
	console.log(req.body.logemail);

	if (req.body.logemail && req.body.logpassword) {
		User.authenticate(req.body.logemail, req.body.logpassword, function(error, user){
			if (error || !user) {
				var err = new Error("Wrong email or password");
				err.status = 401;
				return next(err);
			}
			else {
				req.session.userId = user._id;
				return res.redirect('/dashboard');
			}
		})
	};

	// return res.redirect('/dashboard');


});


//GET route after login

router.get('/dashboard', function (req, res, next) {
	User.findById(req.session.userId)
	.exec(function(error, user) {
		if(error) {
			return next(error);
		}
		else {
			if (user === null) {
				var err = new Error('Not authorized! Go back!');
				err.status = 400;
				return next(err);
			}
			else {
				return res.sendFile('/views/index3.html', {root: './'});
			}
		}
	})
});

// router.get('/dashboard', function (req, res, next) {
// 	return res.sendFile('/views/index3.html', {root: './'});
// });


// GET for logout logout
router.get('/logout', function (req, res, next) {
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});


//GET route for add user
router.get('/adduser', function(req, res, next) {
	console.log("add user");
	return res.sendFile('/views/adduser.html', {root: './'});
})

//POST route for add user
router.post('/adduser', function(req, res, next) {
	console.log(req.body.email);
	console.log(req.body.password);
	// console.log(req.body.email);

	// confirm that user typed same password twice
	if (req.body.password !== req.body.passwordConf) {
		var err = new Error('Passwords do not match.');
		err.status = 400;
		res.send("passwords dont match");
		return next(err);
	}

	if (req.body.email &&
		req.body.username &&
		req.body.password &&
		req.body.passwordConf) {

		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
		}

		User.create(userData, function (error, user) {
			if (error) {
				return next(error);
			} else {
				req.session.userId = user._id;
				return res.redirect('/dashboard');
			}
		});
	}
	else {
		return res.redirect('/dashboard');

	}
});

//GET route after logining
router.get('/dashboard', function(req, res, next) {
	User.findById(res.session.userId)
		.exec(function(error, user){ //The exec() method tests for a match in a string.
			//This method returns the matched text if it finds a match, otherwise it returns null.
			if(error) {
				return next(error);
			}
			else {
				if(user === null) {
					var err = new Error('Not authorized! Go back!');
					err.status = 400; //400- error bad request
					return next(err);
				}
				else {
					return res.sendFile('/views/dashboard.html', {root: './'});
				}
			}

		});
	});

// router.get('/dashboard', function(req, res, next) {
// 	return res.sendFile('/views/dashboard.html', {root: './'});
// }

//Get for logout 

router.get('/logout', function(req, res, next) {
	if(req.session) {
		req.session.destroy(function(err) {
			if (err) {
				return next(err);
			}
			else {
				return res.redirect('/')
			}
		});
	}
});

//get data
var url = "mongodb://tiennguyen.koreasouth.cloudapp.azure.com:27017/";

router.get('/data', function (req, res) {
//connect DB
MongoClient.connect(url,function(err, db){
	if(err) throw err;
	const dbo = db.db("device");
	const col = dbo.collection('data');
	col.find({}).sort({_id: -1}).limit(48).toArray().then(docs => {
		console.log('found data for index');
			// console.log(docs);
			//res index.html 
			// res.send(docs)
			// console.log(typeof docs);
			res.json(docs.reverse());
			// console.log(docs);

			//closes connection to mongodb and logs massage
			db.close(() => console.log("connection closed"));
		})
})

  // res.sendFile('index.html',{root: './'});
});

module.exports = router;