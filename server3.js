var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://fillab:123123123@smartpump.ml:1883')

var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser'); //parse cac request den server
var mongoose = require('mongoose');
const exphbs = require('express-handlebars');

var session = require('express-session');
var MongoStore = require("connect-mongo")(session);

//connect to MongoBD
mongoose.connect('mongodb://localhost/Users', { useNewUrlParser: true, useCreateIndex: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
	//we are connected!
})

//use sessions for tracking logins
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// var fs = require('fs');
var fetch = require('node-fetch');
const path = require('path');

var http = require('http'),
socketIO = require('socket.io'),
server,io;




// set serve static file
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');
server = http.Server(app);
const port = process.env.PORT || 3000;
io = socketIO(server);

// var url = "mongodb://filiotteam.ml:27017/";
// var url = "mongodb://smartpump.ml:27017/";
// var url = "mongodb://27.73.53.224:27017/";
// var url = "mongodb://192.168.0.104/";

var url = "mongodb://localhost:27017";
var url2 = "mongodb://localhost:27017";

io.on('connection', function(socket) {

	function getData() {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if(err)  throw err;
			const dbo = db.db('smartirr');
			const col = dbo.collection('data');
			var count = col.find().count();
			console.log(count);
			col.find({"mac": "68:C6:3A:EA:1E:BC"}).toArray(function(err, docs) {
				// console.log(docs);
				console.log(typeof(docs));
				// docs = docs.reverse();
				socket.emit('datas',docs);

				//clone database from Pi
				// MongoClient.connect(url2, function(err, db) {
				// 	if(err)  throw err;
				// 	const dbo = db.db('smartirr');
				// 	const col = dbo.collection('data');
				// 	col.insertMany(docs);
				// 	console.log("suscessfull");
				// })
			})
		});
	};

	getData();
	setInterval(getData, 30000);

	socket.on('publish', function(msg) {
		console.log(msg);
		  client.publish('/tiennguyen', msg)

		// client.on('connect', function () {

		//   client.subscribe('/tiennguyen')

		//   client.publish('/tiennguyen', 'Hello mqtt')
		//   console.log('connected');
		// })
	})
});

// include routes
var routes = require('./routes/router');
app.use('/', routes);

//catch 04 anf forad to erro handler
app.use(function(req, res, next) {
	var err = new Error('File Not Found');
	err.status = 404;
	next(err);
});

//error handler
//define as the last app.use callback
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send(err.message);
});


// app.get('/', function(req, res) {
// 	res.sendFile(__dirname + '/views/index3.html')
// });

// app.get('/login', function(req, res) {
// 	res.sendFile(__dirname + '/views/login.html')
// })

server.listen(port, () => console.log(`listening on ${port}`));

